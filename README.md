# Hogwarts Great Hall Typing Odyssey ⚡

![Hogwarts Great Hall Typing Odyssey Screenshot](images/screenshot.png)

An immersive, high-aesthetic web-based typing practice game set in the cinematic **Hogwarts Great Hall** from the Harry Potter universe. It features floating candles, starry night sky dynamics, customizable soundtrack uploads, and programmatically synthesized magic Celesta bells playing the iconic Hedwig's Theme intro under Gryffindor fireplace crackles and howling wind storm soundscapes.

---

## 🔮 Core Features

*   **Enchanted Floating Candles**: A custom-designed HTML5 Canvas engine rendering 3D wax cylinders with flickering teardrop flames (blending orange, yellow, and blue gradients) that float slowly up toward the enchanted ceiling and fade away.
*   **Procedural Celesta Synthesizer**: Uses the Web Audio API to procedurally synthesize a metallic celesta chime that loops the nostalgic **Hedwig's Theme** intro melody on click. No external files needed!
*   **Procedural Castle Ambience**: Integrates a castle fireplace firewood crackler and a howling wind storm loop that sweeps through the Great Hall, providing absolute cozy acoustic immersion.
*   **Golden Snitch Visualizer**: A gorgeous circular spectrum visualizer decorated with the Deathly Hallows seal and two Golden Snitch wings that flap and flutter dynamically to the beats/frequencies of your uploaded tracks.
*   **Custom Soundtrack Upload**: Click the velvet chest in the Gryffindor hearth to upload any local audio file (`.mp3`, `.wav`, etc.). Streams locally in the browser instantly with complete privacy.
*   **Quill Scribing Sound Effects**: Programmatically synthesizes the friction scratch of a feather quill writing on thick parchment paper on correct keys, metal drum thuds on typos, and cathedral victory bells on completion.
*   **O.W.L. Ministry of Magic Decree**: Completing the parchment before the hourglass runs out summons a wax-sealed envelope revealing your typing metrics (WPM, Accuracy, Time) and awarding your Wizarding rank:
    *   **🧹 Squib Citizen** (< 20 WPM)
    *   **🎓 Hogwarts Student** (20 - 40 WPM)
    *   **⚡ Ministry Auror** (40 - 60 WPM)
    *   **🦅 Order of the Phoenix Member** (60 - 80 WPM)
    *   **🧙‍♂️ Hogwarts Headmaster** (> 80 WPM with high accuracy!)

---

## 📂 Project Structure

```text
Hogwarts Great Hall Typing Odyssey/
├── index.html        # Hogwarts Great Hall layout, stats & decree structures
├── style.css         # Gryffindor crimson & gold visuals, scroll panels, wood rollers
├── app.js            # Floating candles, Web Audio synthesizer, O.W.L. typing engine
├── hogwarts_bg.png   # Stunning cinematic backdrop of the Great Hall at night
└── README.md         # Full project documentation & instructions
```

---

## ⌨️ Magic Controls & Keyboard Shortcuts

| Key Bind | Action |
| :--- | :--- |
| **Mouse Click** | Focus the parchment scroll to begin typing / Dip your quill in ink |
| **ESC Key** | Instantly reset the parchment scroll and flip the hourglass |
| **Backspace** | Delete mistakes and re-scribe letters in ink |
| **Tab Buttons** | Swap between different spell books (Spell Grimoire, Marauder's Map, etc.) |

---

## 🚀 How to Run Locally

This project requires **no installations, no servers, and no dependencies**. It runs entirely in the browser using raw HTML5, CSS3, and JavaScript:

1.  **Clone or Download** this repository.
2.  Open the folder and **double-click** on **`index.html`** to launch the game instantly in your default web browser (Chrome, Edge, Firefox, or Safari).
3.  Click the scroll to focus, select your preferred spell grimoire from the top, and start casting your typing spell!
4.  The Hedwig's Theme and castle wind/fire ambience can be toggled using the controls panel on the right side. You can also drag and drop your own `.mp3` files to make the Golden Snitch flap its wings in sync with your music.

---

## 🛡️ License

This project is open-source and free to be studied, modded, and shared among all wizards, witches, and muggles under the MIT License.
