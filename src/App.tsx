import { useCallback, useRef, useState } from "react";

function App() {
  const [searchResult, setSearchResult] = useState<any[]>([]);
  const abortController = useRef<AbortController | null>(null);

  async function makeAPICall(searchQuery: string) {
    if (abortController.current) {
      abortController.current.abort();
    }
    const controller = new AbortController();
    abortController.current = controller;

    const response = await fetch(`https://demo.dataverse.org/api/search?q=${searchQuery}`, {
      signal: controller.signal
    });
    const parsedResponse = await response.json();
    setSearchResult(parsedResponse.data.items);
  }

  function debounce(callback: (searchQuery: string) => void, delay: number) {
    let timer: number;

    return function (searchQuery: string) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        callback(searchQuery);
      }, delay);
    }
  }

  const debouncedSearch = useCallback(debounce(makeAPICall, 400), []);

  function searchInputHandler(event: React.ChangeEvent<HTMLInputElement>) {
    debouncedSearch(event.target.value);
  }

  return (
    <>
      <div>
        <input type="text" placeholder="Search" onChange={searchInputHandler} />
      </div>
      <div>
        <ul>
          {
            searchResult.map((result) => <li key={result.name}>{result.name}</li>)
          }
        </ul>
      </div>
    </>
  );
}

export default App;
