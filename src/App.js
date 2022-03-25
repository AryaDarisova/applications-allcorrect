import React from "react";
import Form from "./games_store_parser/Form";
import ReviewsInfo from "./games_store_parser/ReviewsInfo";
import Login from "./auth/Login";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GameStoreParser from "./games_store_parser/GameStoreParser";
import ManagedQualityOnProjectView from "./managed_quality_on_project/view/ManagedQualityOnProjectView";
import ManagedQualityOnProjectCreate from "./managed_quality_on_project/create/ManagedQualityOnProjectCreate";
import ProjectBibleTemplateHeader from "./managed_quality_on_project/project_bible/template_header/ProjectBibleTemplateHeader";
import ProjectBibleTemplateBody from "./managed_quality_on_project/project_bible/template_body/ProjectBibleTemplateBody";
import ProjectBibleTemplateTags from "./managed_quality_on_project/project_bible/template_tags/ProjectBibleTemplateTags";
import ProjectBibleView from "./managed_quality_on_project/project_bible/view/ProjectBibleView";
import ProjectBibleClientView from "./managed_quality_on_project/project_bible/client_view/ProjectBibleClientView";
// import Test from "./test/Test";
// import Test2 from "./test/Test2";
// import Test3 from "./test/Test3";
import logo from "./img/logo1.png";

const styles = {
  companyLogoStyle: {
    paddingLeft: '3rem',
    // margin: '.5rem'
  }
}

function App() {
  function authLogIn() {

  }

  return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-dark">
          <div className="col-12">
            <div style={styles.companyLogoStyle}>
              <a className="navbar-brand" href="#">
                <img src={logo} alt="logo" width="163" height="33"/>
              </a>
            </div>
          </div>
        </nav>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={/*{<Login authLogIn={authLogIn} />}*/<GameStoreParser />} />
            <Route path="/game_store_parser" element={<GameStoreParser /> } />
            <Route path="/managed_quality_on_project/project_bible/template_header" element={<ProjectBibleTemplateHeader /> } />
            <Route path="/managed_quality_on_project/project_bible/template_body" element={<ProjectBibleTemplateBody /> } />
            <Route path="/managed_quality_on_project/project_bible/template_tags" element={<ProjectBibleTemplateTags /> } />
            <Route path="/managed_quality_on_project/project_bible/view" element={<ProjectBibleView /> } />
            <Route path="/managed_quality_on_project/project_bible/client_view" element={<ProjectBibleClientView /> } />
            {/*<Route path="/test" element={<Test /> } />*/}
            {/*<Route path="/test2" element={<Test2 /> } />*/}
            {/*<Route path="/test3" element={<Test3 /> } />*/}



            <Route path="/managed_quality_on_project_create" element={<ManagedQualityOnProjectCreate /> } />
            <Route path="/managed_quality_on_project_view" element={<ManagedQualityOnProjectView /> } />
          </Routes>
        </BrowserRouter>
      </div>
  );
}

export default App;
