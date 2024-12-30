import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Blog from "./Sidebar/Blog";

function MainFlow() {
  return (
    <div>
      <div className="row">
        <div className="col-3">
          <Sidebar />
        </div>
        <div className="col-9">
          <div className="row">
            <div className="col-12">
              <Header />
            </div>
            <div className="col-12">
              <Routes>
                <Route
                  path="Blog"
                  element={
                    <>
                       <Blog/>
                    </>
                  }
                />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainFlow;
