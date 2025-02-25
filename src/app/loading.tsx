import Loader from "@/components/Loader";

function loading() {
  return (
    <div className="h-screen w-screen bg-[#ffffff4d] backdrop-blur-md">
      <Loader />
    </div>
  );
}

export default loading;
