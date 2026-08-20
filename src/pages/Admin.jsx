import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Edit3, ImagePlus, LogOut, Plus, Save, Trash2, UploadCloud } from "lucide-react";

const OWNER = "GustaScholz";
const REPO = "ciclo-infinite";
const BRANCH = "main";
const DATA_PATH = "public/data/products.json";
const DEFAULT_SIZES = ["PP", "P", "M", "G", "GG", "XGG", "Único"];
const EMPTY = { id: null, name: "", price: "", category: "Camisetas", description: "", isNew: true, active: true, sizeOptions: ["P", "M", "G", "GG"], sizes: ["P", "M", "G", "GG"], images: [] };

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

function Admin() {
  const [token, setToken] = useState(() => sessionStorage.getItem("cicloAdminToken") || "");
  const [tokenInput, setTokenInput] = useState("");
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [customSize, setCustomSize] = useState("");

  const sortedProducts = useMemo(() => [...products].sort((a, b) => Number(b.id) - Number(a.id)), [products]);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/products.json?t=${Date.now()}`, { cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Não foi possível carregar o catálogo")))
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((error) => setStatus(error.message));
  }, []);

  async function connect() {
    const value = tokenInput.trim();
    if (!value) return;
    setBusy(true);
    setStatus("Validando acesso...");
    try {
      await github(`/repos/${OWNER}/${REPO}`, value);
      sessionStorage.setItem("cicloAdminToken", value);
      setToken(value);
      setTokenInput("");
      setStatus("Acesso conectado. Você já pode publicar alterações.");
    } catch (error) {
      setStatus(`Não consegui conectar: ${error.message}`);
    } finally {
      setBusy(false);
    }
  }

  function logout() {
    sessionStorage.removeItem("cicloAdminToken");
    setToken("");
    setStatus("Sessão encerrada.");
  }

  function newProduct() {
    setEditingId(null);
    setForm({ ...EMPTY, id: Date.now() });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function editProduct(product) {
    const sizeOptions = product.sizeOptions?.length ? product.sizeOptions : (product.sizes?.length ? product.sizes : ["P", "M", "G", "GG"]);
    setEditingId(product.id);
    setForm({ ...EMPTY, ...product, price: String(product.price).replace(".", ","), sizeOptions, sizes: product.sizes || [], images: product.images || (product.image ? [product.image] : []) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toggleSizeOption(size) {
    setForm((current) => {
      const selected = current.sizeOptions.includes(size);
      const sizeOptions = selected ? current.sizeOptions.filter((item) => item !== size) : [...current.sizeOptions, size];
      return { ...current, sizeOptions, sizes: current.sizes.filter((item) => sizeOptions.includes(item)) };
    });
  }

  function toggleAvailable(size) {
    if (!form.sizeOptions.includes(size)) return;
    setForm((current) => ({ ...current, sizes: current.sizes.includes(size) ? current.sizes.filter((item) => item !== size) : [...current.sizes, size] }));
  }

  function addCustomSize() {
    const size = customSize.trim().toUpperCase();
    if (!size || form.sizeOptions.includes(size)) return;
    setForm((current) => ({ ...current, sizeOptions: [...current.sizeOptions, size], sizes: [...current.sizes, size] }));
    setCustomSize("");
  }

  function saveDraft(event) {
    event.preventDefault();
    const price = Number(String(form.price).replace(",", "."));
    if (!form.name.trim() || !form.category.trim() || Number.isNaN(price)) {
      setStatus("Preencha nome, categoria e preço corretamente.");
      return;
    }
    const product = { ...form, id: editingId ?? form.id ?? Date.now(), name: form.name.trim(), category: form.category.trim(), description: form.description.trim(), price, sizes: form.sizes.filter((size) => form.sizeOptions.includes(size)), images: form.images.filter(Boolean) };
    setProducts((current) => current.some((item) => String(item.id) === String(product.id)) ? current.map((item) => String(item.id) === String(product.id) ? product : item) : [product, ...current]);
    setEditingId(product.id);
    setForm({ ...product, price: String(product.price).replace(".", ",") });
    setDirty(true);
    setStatus("Salvo no painel. Clique em “Publicar alterações” para atualizar o site.");
  }

  function removeProduct(product) {
    if (!window.confirm(`Remover “${product.name}” do catálogo?`)) return;
    setProducts((current) => current.filter((item) => String(item.id) !== String(product.id)));
    if (String(editingId) === String(product.id)) { setEditingId(null); setForm(EMPTY); }
    setDirty(true);
    setStatus("Produto removido no painel. Publique para aplicar no site.");
  }

  async function uploadImages(files) {
    if (!token) { setStatus("Conecte a chave do GitHub antes de enviar fotos."); return; }
    if (!files?.length) return;
    setBusy(true);
    setStatus("Enviando fotos...");
    try {
      const uploaded = [];
      for (const [index, file] of Array.from(files).entries()) {
        const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const safeName = file.name.replace(/\.[^/.]+$/, "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9-_]+/g, "-").toLowerCase();
        const filename = `${Date.now()}-${index}-${safeName}.${extension}`;
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result).split(",")[1]);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        await github(`/repos/${OWNER}/${REPO}/contents/public/images/products/${filename}`, token, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: `Adiciona foto ${filename}`, content: base64, branch: BRANCH }),
        });
        uploaded.push(`images/products/${filename}`);
      }
      setForm((current) => ({ ...current, images: [...current.images, ...uploaded] }));
      setStatus(`${uploaded.length} foto(s) enviada(s). Salve o produto e publique.`);
    } catch (error) {
      setStatus(`Erro ao enviar foto: ${error.message}`);
    } finally {
      setBusy(false);
    }
  }

  async function publish() {
    if (!token) { setStatus("Conecte sua chave do GitHub para publicar."); return; }
    setBusy(true);
    setStatus("Publicando catálogo...");
    try {
      const current = await github(`/repos/${OWNER}/${REPO}/contents/${DATA_PATH}?ref=${BRANCH}`, token);
      await github(`/repos/${OWNER}/${REPO}/contents/${DATA_PATH}`, token, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Atualiza catálogo pelo painel administrativo", content: encodeBase64(`${JSON.stringify(products, null, 2)}\n`), sha: current.sha, branch: BRANCH }),
      });
      setDirty(false);
      setStatus("Publicado! O GitHub está atualizando o site. Normalmente leva cerca de 1 minuto.");
    } catch (error) {
      setStatus(`Erro ao publicar: ${error.message}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-950">
      <header className="bg-black text-white sticky top-0 z-30">
        <div className="site-container h-16 flex items-center gap-4">
          <a href="#/" className="flex items-center gap-2 text-sm hover:opacity-70"><ArrowLeft size={20} /> Catálogo</a>
          <div className="mx-auto font-black tracking-[5px]">CICLO ADMIN</div>
          {token ? <button onClick={logout} className="flex items-center gap-2 text-sm hover:opacity-70"><LogOut size={18} /><span className="hidden sm:inline">Sair</span></button> : <div className="w-10" />}
        </div>
      </header>

      <main className="site-container py-8 sm:py-10">
        {!token && (
          <section className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm mb-8">
            <h1 className="text-2xl sm:text-3xl font-black">Acesso do administrador</h1>
            <p className="text-zinc-600 mt-3 max-w-3xl leading-relaxed">Use uma chave fine-grained do GitHub com acesso somente ao repositório <strong>GustaScholz/ciclo-infinite</strong> e permissão <strong>Contents: Read and write</strong>. A chave fica apenas nesta sessão do navegador e nunca é gravada no site.</p>
            <div className="mt-5 flex flex-col sm:flex-row gap-3 max-w-3xl">
              <input type="password" value={tokenInput} onChange={(event) => setTokenInput(event.target.value)} placeholder="Cole a chave do GitHub aqui" className="flex-1 border border-zinc-300 rounded-xl px-4 h-12 outline-none focus:border-black" />
              <button disabled={busy} onClick={connect} className="bg-black text-white px-6 h-12 rounded-xl font-bold disabled:opacity-50">Conectar</button>
            </div>
            <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noreferrer" className="inline-block mt-4 text-sm underline">Criar chave fine-grained no GitHub</a>
          </section>
        )}

        {status && <div className="mb-7 rounded-2xl bg-zinc-900 text-white px-5 py-4 text-sm">{status}</div>}

        <div className="grid grid-cols-1 xl:grid-cols-[430px_1fr] gap-8 items-start">
          <section className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm xl:sticky xl:top-24">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div><p className="text-xs uppercase tracking-[3px] text-zinc-500">Produto</p><h2 className="text-2xl font-black mt-1">{editingId ? "Editar roupa" : "Nova roupa"}</h2></div>
              <button onClick={newProduct} className="w-11 h-11 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-zinc-200"><Plus size={21} /></button>
            </div>

            <form onSubmit={saveDraft} className="space-y-4">
              <label className="block"><span className="text-sm font-semibold">Nome</span><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-2 w-full border rounded-xl px-4 h-11 outline-none focus:border-black" /></label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block"><span className="text-sm font-semibold">Preço</span><input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="mt-2 w-full border rounded-xl px-4 h-11 outline-none focus:border-black" placeholder="89,90" /></label>
                <label className="block"><span className="text-sm font-semibold">Categoria</span><input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="mt-2 w-full border rounded-xl px-4 h-11 outline-none focus:border-black" /></label>
              </div>
              <label className="block"><span className="text-sm font-semibold">Descrição</span><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows="4" className="mt-2 w-full border rounded-xl px-4 py-3 outline-none focus:border-black resize-none" /></label>

              <div><p className="text-sm font-semibold">Tamanhos da peça</p><div className="flex flex-wrap gap-2 mt-2">{DEFAULT_SIZES.map((size) => <button type="button" key={size} onClick={() => toggleSizeOption(size)} className={`px-3 py-2 rounded-full border text-sm ${form.sizeOptions.includes(size) ? "bg-black text-white border-black" : "border-zinc-300"}`}>{size}</button>)}</div><div className="flex gap-2 mt-3"><input value={customSize} onChange={(e) => setCustomSize(e.target.value)} placeholder="Outro tamanho" className="flex-1 border rounded-xl px-3 h-10 outline-none focus:border-black" /><button type="button" onClick={addCustomSize} className="border border-black rounded-xl px-4 text-sm font-semibold">Adicionar</button></div></div>

              <div><p className="text-sm font-semibold">Disponíveis em estoque</p><p className="text-xs text-zinc-500 mt-1">Desmarcado = tamanho aparece bloqueado para o cliente.</p><div className="flex flex-wrap gap-2 mt-3">{form.sizeOptions.map((size) => <button type="button" key={size} onClick={() => toggleAvailable(size)} className={`px-4 py-2 rounded-full border text-sm ${form.sizes.includes(size) ? "bg-emerald-600 text-white border-emerald-600" : "bg-zinc-100 text-zinc-400 border-zinc-200 line-through"}`}>{size}</button>)}</div></div>

              <div><div className="flex items-center justify-between"><p className="text-sm font-semibold">Fotos</p><label className={`inline-flex items-center gap-2 text-sm font-semibold ${token ? "cursor-pointer" : "opacity-40 cursor-not-allowed"}`}><ImagePlus size={18} /> Adicionar<input type="file" accept="image/*" multiple disabled={!token || busy} onChange={(e) => uploadImages(e.target.files)} className="hidden" /></label></div><div className="grid grid-cols-3 gap-2 mt-3">{form.images.map((image, index) => <div key={`${image}-${index}`} className="relative aspect-[3/4] bg-zinc-100 rounded-xl overflow-hidden"><img src={`${import.meta.env.BASE_URL}${image.replace(/^\//, "")}`} alt="" className="w-full h-full object-cover" /><button type="button" onClick={() => setForm((current) => ({ ...current, images: current.images.filter((_, i) => i !== index) }))} className="absolute top-1 right-1 bg-white/90 w-7 h-7 rounded-full text-xs font-bold">✕</button></div>)}{form.images.length === 0 && <div className="col-span-3 border border-dashed rounded-xl py-8 text-center text-sm text-zinc-400">Nenhuma foto adicionada</div>}</div></div>

              <div className="grid grid-cols-2 gap-3"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isNew} onChange={(e) => setForm({ ...form, isNew: e.target.checked })} /> Novidades</label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Visível no site</label></div>
              <button type="submit" className="w-full bg-black text-white rounded-xl h-12 font-bold flex items-center justify-center gap-2"><Save size={19} /> Salvar no painel</button>
            </form>
          </section>

          <section>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5"><div><p className="text-xs uppercase tracking-[3px] text-zinc-500">Catálogo</p><h2 className="text-3xl font-black mt-1">{products.length} produtos</h2><p className="text-zinc-500 mt-1">Edite ou remova peças daqui.</p></div><button disabled={!dirty || busy || !token} onClick={publish} className="bg-emerald-600 text-white rounded-xl px-5 h-12 font-bold flex items-center justify-center gap-2 disabled:bg-zinc-300 disabled:text-zinc-500"><UploadCloud size={20} /> {busy ? "Aguarde..." : "Publicar alterações"}</button></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{sortedProducts.map((product) => <article key={product.id} className={`bg-white rounded-2xl p-4 shadow-sm flex gap-4 ${product.active === false ? "opacity-50" : ""}`}><div className="w-24 h-32 bg-zinc-100 rounded-xl overflow-hidden shrink-0">{product.images?.[0] || product.image ? <img src={`${import.meta.env.BASE_URL}${(product.images?.[0] || product.image).replace(/^\//, "")}`} alt={product.name} className="w-full h-full object-cover" /> : <div className="w-full h-full grid place-items-center text-xs text-zinc-400">Sem foto</div>}</div><div className="min-w-0 flex-1"><p className="text-xs uppercase tracking-[2px] text-zinc-500 truncate">{product.category}</p><h3 className="font-bold mt-1 leading-tight break-words">{product.name}</h3><p className="font-semibold mt-1">R$ {Number(product.price).toFixed(2).replace(".", ",")}</p><p className="text-xs text-zinc-500 mt-2">Disponíveis: {(product.sizes || []).join(", ") || "nenhum"}</p><div className="flex items-center gap-2 mt-3"><button onClick={() => editProduct(product)} className="w-9 h-9 rounded-full bg-zinc-100 grid place-items-center"><Edit3 size={17} /></button><button onClick={() => removeProduct(product)} className="w-9 h-9 rounded-full bg-red-50 text-red-600 grid place-items-center"><Trash2 size={17} /></button></div></div></article>)}</div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Admin;
