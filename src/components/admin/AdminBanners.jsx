import { useEffect, useState } from "react";
import { ImagePlus, Plus, Save, Trash2, UploadCloud } from "lucide-react";

const OWNER = "GustaScholz";
const REPO = "ciclo-infinite";
const BRANCH = "main";
const DATA_PATH = "public/data/banners.json";

function encodeBase64(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}

async function github(path, token, options = {}) {
  const response = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || `Erro ${response.status}`);
  return data;
}

function assetUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}

function AdminBanners({ token }) {
  const [banners, setBanners] = useState([]);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/banners.json?t=${Date.now()}`, { cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Não foi possível carregar os banners")))
      .then((data) => setBanners(Array.isArray(data) ? data : []))
      .catch((error) => setStatus(error.message));
  }, []);

  function updateBanner(index, field, value) {
    setBanners((current) => current.map((banner, bannerIndex) => bannerIndex === index ? { ...banner, [field]: value } : banner));
    setDirty(true);
  }

  function addBanner() {
    setBanners((current) => [...current, {
      id: Date.now(),
      image: "",
      title: "NOVO BANNER",
      subtitle: "Descrição do banner",
      buttonText: "VER COLEÇÃO",
    }]);
    setDirty(true);
  }

  function removeBanner(index) {
    if (!window.confirm("Remover este banner do carrossel?")) return;
    setBanners((current) => current.filter((_, bannerIndex) => bannerIndex !== index));
    setDirty(true);
  }

  async function uploadImage(index, file) {
    if (!token) {
      setStatus("Conecte a chave do GitHub antes de enviar a imagem.");
      return;
    }
    if (!file) return;

    setBusy(true);
    setStatus("Enviando imagem do banner...");
    try {
      const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const safeName = file.name
        .replace(/\.[^/.]+$/, "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9-_]+/g, "-")
        .toLowerCase();
      const filename = `${Date.now()}-${safeName}.${extension}`;
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      await github(`/repos/${OWNER}/${REPO}/contents/public/images/banners-admin/${filename}`, token, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: `Adiciona banner ${filename}`, content: base64, branch: BRANCH }),
      });

      updateBanner(index, "image", `images/banners-admin/${filename}`);
      setStatus("Imagem enviada. Clique em “Publicar banners” para aplicar no carrossel.");
    } catch (error) {
      setStatus(`Erro ao enviar imagem: ${error.message}`);
    } finally {
      setBusy(false);
    }
  }

  async function publish() {
    if (!token) {
      setStatus("Conecte sua chave do GitHub para publicar os banners.");
      return;
    }
    if (banners.length === 0) {
      setStatus("O carrossel precisa ter pelo menos um banner.");
      return;
    }

    setBusy(true);
    setStatus("Publicando banners...");
    try {
      const current = await github(`/repos/${OWNER}/${REPO}/contents/${DATA_PATH}?ref=${BRANCH}`, token);
      await github(`/repos/${OWNER}/${REPO}/contents/${DATA_PATH}`, token, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Atualiza banners pelo painel administrativo",
          content: encodeBase64(`${JSON.stringify(banners, null, 2)}\n`),
          sha: current.sha,
          branch: BRANCH,
        }),
      });
      setDirty(false);
      setStatus("Banners publicados! O GitHub está atualizando o site.");
    } catch (error) {
      setStatus(`Erro ao publicar banners: ${error.message}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-xs uppercase tracking-[3px] text-zinc-500">Carrossel</p>
          <h2 className="text-3xl font-black mt-1">Banners</h2>
          <p className="text-zinc-500 mt-1">Altere imagem, título, descrição e texto do botão.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button onClick={addBanner} className="border border-black rounded-xl px-5 h-12 font-bold flex items-center justify-center gap-2"><Plus size={19} /> Novo banner</button>
          <button disabled={!dirty || busy || !token} onClick={publish} className="bg-emerald-600 text-white rounded-xl px-5 h-12 font-bold flex items-center justify-center gap-2 disabled:bg-zinc-300 disabled:text-zinc-500"><UploadCloud size={20} /> {busy ? "Aguarde..." : "Publicar banners"}</button>
        </div>
      </div>

      {status && <div className="mb-6 rounded-2xl bg-zinc-900 text-white px-5 py-4 text-sm">{status}</div>}

      <div className="space-y-6">
        {banners.map((banner, index) => (
          <article key={banner.id ?? index} className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <p className="text-xs uppercase tracking-[3px] text-zinc-500">Slide {index + 1}</p>
                <h3 className="text-xl font-black mt-1">{banner.title || "Sem título"}</h3>
              </div>
              <button onClick={() => removeBanner(index)} className="w-10 h-10 rounded-full bg-red-50 text-red-600 grid place-items-center" title="Remover banner"><Trash2 size={18} /></button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-6">
              <div>
                <div className="relative aspect-[16/7] bg-zinc-200 rounded-2xl overflow-hidden">
                  {banner.image ? <img src={assetUrl(banner.image)} alt={banner.title} className="w-full h-full object-cover" /> : <div className="absolute inset-0 grid place-items-center text-zinc-400">Nenhuma imagem</div>}
                  <div className="absolute inset-0 bg-black/35 flex items-center justify-center text-center px-5">
                    <div className="text-white">
                      <p className="text-2xl sm:text-3xl font-black tracking-[5px]">{banner.title}</p>
                      <p className="text-sm mt-2 text-white/85">{banner.subtitle}</p>
                    </div>
                  </div>
                </div>
                <label className={`mt-3 w-full border border-dashed border-zinc-300 rounded-xl h-12 flex items-center justify-center gap-2 font-semibold text-sm ${token && !busy ? "cursor-pointer hover:border-black" : "opacity-40 cursor-not-allowed"}`}>
                  <ImagePlus size={19} /> Trocar imagem
                  <input type="file" accept="image/*" disabled={!token || busy} onChange={(event) => uploadImage(index, event.target.files?.[0])} className="hidden" />
                </label>
              </div>

              <div className="space-y-4">
                <label className="block"><span className="text-sm font-semibold">Título</span><input value={banner.title || ""} onChange={(event) => updateBanner(index, "title", event.target.value)} className="mt-2 w-full border rounded-xl px-4 h-11 outline-none focus:border-black" /></label>
                <label className="block"><span className="text-sm font-semibold">Descrição</span><textarea value={banner.subtitle || ""} onChange={(event) => updateBanner(index, "subtitle", event.target.value)} rows="4" className="mt-2 w-full border rounded-xl px-4 py-3 outline-none focus:border-black resize-none" /></label>
                <label className="block"><span className="text-sm font-semibold">Texto do botão</span><input value={banner.buttonText || ""} onChange={(event) => updateBanner(index, "buttonText", event.target.value)} className="mt-2 w-full border rounded-xl px-4 h-11 outline-none focus:border-black" /></label>
                <div className="rounded-xl bg-zinc-100 p-4 text-xs text-zinc-500">O botão continua levando para a seção de produtos. A ordem dos cards acima é a ordem do carrossel.</div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {banners.length > 0 && <div className="mt-6 flex justify-end"><button disabled={!dirty || busy || !token} onClick={publish} className="bg-black text-white rounded-xl px-6 h-12 font-bold flex items-center justify-center gap-2 disabled:bg-zinc-300 disabled:text-zinc-500"><Save size={19} /> Publicar banners</button></div>}
    </section>
  );
}

export default AdminBanners;
