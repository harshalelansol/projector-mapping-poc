# 📽️ Projector Mapping POC

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg) ![License](https://img.shields.io/badge/license-MIT-green.svg)

A powerful, web-based tool for creating dynamic projection mapping visualizations directly in your browser. Built with **Next.js** and **Konva**.

---

## ✨ Features

### 🎨 Creative Tools

- **Geometric Shapes**: Easily add Rectangles 🟥, Circles 🔵, and Polygons 🔷.
- **Free Draw (Pen)** ✏️: Draw custom shapes freely. Features smart **Snap-to-Close** logic to automatically create closed polygons.
- **Text Support** ✍️: Add text with customizable fonts, sizes, and colors.
- **Media Integration**: Upload Images 🖼️ and Videos 🎥 directly onto the canvas. Videos feature optimized smooth playback.

### 🛠️ Advanced Controls

- **Multi-Selection**: Hold `Ctrl` (or `Cmd`) to select and manipulate multiple objects at once.
- **Transformers**: Drag, Resize, and Rotate single or multiple shapes seamlessly.
- **Undo/Redo**: Full history support with `Ctrl+Z` / `Ctrl+Y`.
- **Projection Overlay**: Built-in calibration tools for adjusting the projection perspective.

### 💄 Styling & Effects

- **Premium Property Panel**: Glassmorphic UI for real-time editing.
- **Fill & Outline**: Toggle between solid fills and outlined shapes.
- **Animations**: Bring shapes to life with built-in effects:
  - ✨ **Sparkle**
  - 🔄 **Move**
  - 🚥 **Blink**
  - 🏃 **Moving Borders**

### 💻 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (React)
- **Canvas Engine**: [React-Konva](https://konvajs.org/docs/react/)
- **UI Components**: [MUI (Material UI)](https://mui.com/)
- **Icons**: MUI Icons

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/projector-mapping-poc.git
    cd projector-mapping-poc
    ```

2.  **Install dependencies**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the development server**

    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎮 Controls & Shortcuts

| Action             | Shortcut                       |
| :----------------- | :----------------------------- |
| **Undo**           | `Ctrl + Z`                     |
| **Redo**           | `Ctrl + Y`                     |
| **Multi-Select**   | `Ctrl + Click`                 |
| **Delete**         | `Delete`                       |
| **Finish Drawing** | `Enter` (or click Start Point) |
| **Cancel Drawing** | `Esc`                          |

---

## 📸 Usage Tips

- **Free Draw**: Click to place points. To close the shape, simply click back on your starting point (marked with a dot).
- **Video**: For best performance, ensure your browser has hardware acceleration enabled.
- **Projection**: Use the calibration corners to map the canvas to your physical surface.
