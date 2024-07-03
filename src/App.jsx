import React from "react"
import { Outlet, ScrollRestoration } from "react-router-dom"

// import NavBar from "./components/Navbar"

function App() {
  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  )
}

export default App