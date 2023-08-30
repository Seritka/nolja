import { Head } from "$fresh/runtime.ts";
import { useSignal } from "@preact/signals";
import SearchBar from '../islands/SearchBar.tsx';

export default function Home() {
  return <SearchBar/>
}
