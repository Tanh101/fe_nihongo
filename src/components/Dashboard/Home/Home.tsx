import React from "react";

function Home() {
  // TODO: Fetch the data from your backend and store it in state variables

  return (
    <div className="flex flex-col items-center justify-start bg-gray-100 h-screen w-full">
      <div className="flex justify-around w-full mb-10 mt-16">
        <h2 className="text-[20px] font-semibold bg-blue-500 text-black p-2 rounded">
          Total number of users: {/* TODO: Display total number of users */}
        </h2>
        <h2 className="text-[20px] font-semibold bg-green-500 text-black p-2 rounded">
          Total number of topics: {/* TODO: Display total number of topics */}
        </h2>
        <h2 className="text-[20px] font-semibold bg-red-500 text-black p-2 rounded">
          Total number of lessons: {/* TODO: Display total number of lessons */}
        </h2>
        <h2 className="text-[20px] font-semibold bg-amber-500 text-black p-2 rounded">
          Total number of words: {/* TODO: Display total number of words */}
        </h2>
      </div>

      <div className="flex justify-around w-full mb-10">
        <div className="w-1/3 bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-start">
          <h2 className="text-xl font-bold mb-4">Newly registered users</h2>
          <table className="w-full">
            {/* TODO: Display a table of new registered users */}
          </table>
        </div>

        <div className="w-1/3 bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-start">
          <h2 className="text-xl font-bold mb-4">Newly created words</h2>
          <table className="w-full">
            {/* TODO: Display a table of newly created words */}
          </table>
        </div>

        <div className="w-1/3 bg-white rounded-lg shadow-md p-6 flex flex-col items-center jusify-start">
          <h2 className="text-xl font-bold mb-4">Newly created lessons</h2>
          <table className="w-full">
            {/* TODO: Display a table of newly created lessons */}
          </table>
        </div>
      </div>
    </div>
  );
}

export default Home;
