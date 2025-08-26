import { mdiHammerWrench, mdiTractor } from "@mdi/js";
import Icon from "@mdi/react";
import { Link } from "react-router";

const LandingPage = () => {
    return(
        <section className="w-full h-screen">
            <div className="w-full h-full flex justify-center items-center gap-20 mt-7 px-4 bg-gray-200">
                <Link to="/accueil/atelier">
                <div className="card w-96 shadow-sm text-black flex flex-col items-center bg-white hover:bg-orange-200 hover:cursor-pointer hover:shadow-lg transition
                duration-300 ease-in-out">
                    <figure className="px-10 pt-10">
                        <Icon path={mdiTractor} size={8} />
                    </figure>                            
                    <div className="card-body items-center text-center">
                        <h2 className="card-title text-2xl">Atelier</h2>                        
                    </div>
                </div>
                </Link>
                <Link to="/accueil/services-generaux">
                <div className="card w-96 shadow-sm text-black flex flex-col items-center bg-white hover:bg-green-200 hover:cursor-pointer hover:shadow-lg transition
                duration-300 ease-in-out">
                    <figure className="px-10 pt-10">
                        <Icon path={mdiHammerWrench} size={8} />
                    </figure>                            
                    <div className="card-body items-center text-center">
                        <h2 className="card-title text-2xl">Services généraux</h2>                        
                    </div>
                </div>
                </Link>
            </div>
        </section>
    );
};

export default LandingPage