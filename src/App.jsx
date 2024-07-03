import React from "react"
import { Outlet, ScrollRestoration } from "react-router-dom"

// import NavBar from "./components/Navbar"

function App() {
  return (
    <>
      <ScrollRestoration />
      {/* <NavBar /> */}
      <Outlet />
    </>
  )
}

export default App