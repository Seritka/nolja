import { useSignal } from "@preact/signals";


export default function SearchBar() {
    const text = useSignal("")

  return (
    <div class="flex flex-col h-full" style={{ 'font-family': 'YanoljaYacheR, serif' }}>
        <div class="flex-none">
        <h1 class="p-5 text(6xl gray-900) font-bold text-center">놀자 ({/*<span class="line-through">YA</span>*/}NOLJA)</h1>
        </div>
        <div class="flex-1">
        <div class="p-5 mx-auto max-w-screen-md">
        <label class="relative block">
        <span class="sr-only">Search</span>
        <span class="absolute inset-y-0 left-0 flex items-center pl-2">
        <svg class="h-6 w-6 fill-slate-300" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path>
        </svg>
        </span>
        <input class="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-md focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-md" placeholder="Search for anything..." type="text" name="search" onInput={e => {
            text.value = e.target.value
        }} onkeyup={(e) => {
            if (window.event.keyCode === 13) {
                window.location.href = "/" + 'search_' + text.value
            }
        }} />
        </label>
        </div>
        </div>
    </div>
  );
}