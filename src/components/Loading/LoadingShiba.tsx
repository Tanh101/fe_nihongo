import "./LoadingShiba.scss";
import LoadingShibaGif from "../../assets/loading_shiba_1.gif";
import LoadingGif from "../../assets/loading.gif";
function LoadingShiba() {
  return (
    <div className="loading_container w-full h-full bg-black bg-opacity-30 flex flex-col items-center justify-center z-50 absolute top-0">
      <img
        src={LoadingShibaGif}
        alt="loading shiba"
        className="w-52 h-80 object-cover"
      />
      <img
        src={LoadingGif}
        alt="loading"
        className="w-80 h-20 mt-[-40px] object-cover"
      />
      <h3 className="text-white font-semibold text-lg w-full h-20 flex flex-col items-center justify-start">
        Loading...
      </h3>
    </div>
  );
}

export default LoadingShiba;
