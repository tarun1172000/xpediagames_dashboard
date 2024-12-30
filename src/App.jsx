import React from "react";
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import LoginPage from "./components/LoginPage";
import Header from "./components/Header"; // Import the Header component
import Blog from "./components/Sidebar/Blog";
import { Outlet } from "react-router-dom";
import Game from "./components/Sidebar/Game";
import Promo from "./components/Sidebar/Promo";
import Brands from "./components/Sidebar/Brands";



const Layout = () => (
  <>
    <div className="">
      <div className="row">
        <div className="col-3">
          <Sidebar />
        </div>
        <div className="col-9">
          <div className="row ">
            <div className="col-12">
              <Header />
            </div>
            <div className="col-12">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);

const App = () => {
  const theme = createTheme({
    palette: {
      mode: "dark",
      background: {
        default: "#121212",
        paper: "#1E1E1E",
      },
      text: {
        primary: "#ffffff",
      },
    },
  });

  return (
    <ThemeProvider className={"container"} theme={theme}>
      <Router>
        <Box className={"container"}>
          <CssBaseline />

          {/* Define routes */}
          <Routes>
            {/* Route for login page */}
            <Route path="/login" element={<LoginPage />} />

            {/* Route for dashboard with Sidebar and Header */}
            <Route path="/" element={<Layout />}>
              {/* Nested route for Blog */}
              <Route path="/blog" element={<Blog />} />
              <Route path="/game" element={<Game/>} />
              <Route path="/promo" element={<Promo/>} />
              <Route path="/Brands" element={<Brands/>} />

             

           



            </Route>
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
