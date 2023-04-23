import { useRouter } from "next/router";
import { NextShield } from "next-shield";
import { useSelector } from "react-redux";

export function Shield({ children }) {
  const router = useRouter();

  const { isAuth, loading } = useSelector((state) => state.Shield);
  // console.log(loading, "loading-->");
  const shieldConfig = {
    router,
    isAuth,
    isLoading: loading,
    privateRoutes: ["/help/raise-ticket"],
    publicRoutes: ["/authentication"],
    hybridRoutes: ["/"],
    loginRoute: "/authentication",
    accessRoute: "/dashboard",
    LoadingComponent: (
      <div className={`LoadingScreen dark`}>
        <div className="lds">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    ),
    // RBAC:{
    //     admin:{

    //     }
    // },
    // userRole: userRole,
  };

  return <NextShield {...shieldConfig}>{children}</NextShield>;
}

export default Shield;
