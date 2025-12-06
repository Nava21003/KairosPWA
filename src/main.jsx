import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { router } from "./pages/Routes/routes.jsx";
import { RouterProvider } from "react-router-dom";
import ReloadPrompt from "./ReloadPrompt.jsx";
import AuthState from "./Context/Auth/AuthState.jsx";
import RoleState from "./Context/Roles/RoleState.jsx";
import LugaresState from "./Context/Lugares/LugaresState.jsx";
import PromocionesState from "./Context/Promociones/PromocionesState.jsx";
import UserState from "./Context/User/UserState.jsx";
import CategoriasState from "./Context/Categorias/CategoriasState.jsx";
import InteresesState from "./Context/Intereses/InteresesState.jsx";
import PuntosInteresState from "./Context/PuntosInteres/PuntosInteresState.jsx";
import FaqState from "./Context/Faq/FaqState.jsx";
import MensajesState from "./Context/Mensajes/MensajesState.jsx";
import ReseniasState from "./Context/Resenias/ReseniasState.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <FaqState>
      <ReseniasState>
        <MensajesState>
          <AuthState>
            <RoleState>
              <PromocionesState>
                <LugaresState>
                  <UserState>
                    <InteresesState>
                      <CategoriasState>
                        <PuntosInteresState>
                          <RouterProvider router={router} />
                        </PuntosInteresState>
                      </CategoriasState>
                    </InteresesState>
                  </UserState>
                </LugaresState>
              </PromocionesState>
            </RoleState>
          </AuthState>
          <ReloadPrompt />
        </MensajesState>
      </ReseniasState>
    </FaqState>
  </StrictMode>
);
