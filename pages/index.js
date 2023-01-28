import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [animalInput, setAnimalsInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal: animalInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      const imageUrl = data.result.match(/https:\/\/image\.pollinations\.ai\/prompt\/[^\s]+/)[0];

      setResult(imageUrl);
      setAnimalsInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Image Generator powered by OpenAI & PollinationsAI</title>
        <link rel="icon" href="/Halcyonic.png" />
      </Head>

      <main className={styles.main}>
        <img src="C:\Users\leewe\Desktop\new-image-generator\public\Halcyonic.png" className={styles.icon} />
        <h3>Generate an Image!</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="animal"
            placeholder="Enter a Description"
            value={animalInput}
            onChange={(e) => setAnimalsInput(e.target.value)}
          />
          <input type="submit" value="Generate an Image" />
        </form>
        <div className={styles.result}>
          {result && <img src={result} alt="Generated image" />}
      </div>
    </main>
  </div>
  );
}
