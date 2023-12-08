import React, { useState } from 'react';
import { Toastify } from '../../../toastify/Toastify';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import customAxios from '../../../api/AxiosInstance';
import { useNavigate } from "react-router-dom";

interface Topic {
    name: string;
    description: string;
}

function Topic() {

    const navigate = useNavigate(); // Initialize the history object

    const [newTopic, setNewTopic] = useState<Topic>({
        name: '',
        description: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewTopic({
            ...newTopic,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', newTopic.name);
        formData.append('description', newTopic.description);

        customAxios.post('http://127.0.0.1:8000/api/test/topics', formData)
            .then((response) => {
                if (response.status === 200) {
                    Toastify.success(response.data.message);
                    navigate("/learn");
                }
            })
            .catch((error) => {
                if (error.response.status === 400) {
                    if (error.response.data.errors.name) {
                        toast.error(error.response.data.errors.name[0]);
                    }
                    if (error.response.data.errors.description) {
                        toast.error(error.response.data.errors.description[0]);
                    }
                } else {
                    console.error("Unexpected error:", error.response.data);
                }
            });
    };

    return (
        <div className="flex flex-1 justify-center items-center h-screen text-lg bg-slate-300">
            <form onSubmit={handleSubmit} className="">
                <div className="form w-[556px] py-16 px-16 bg-white shadow-lg rounded-3xl">
                    <label
                        htmlFor="name"
                        className="login-label mb-4 block font-bold text-gray-700"
                    >
                        Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        className="focus:border-green-500 focus:outline-none block w-full rounded-2xl text-sm border py-2 mt-1 px-3"
                        name="name"
                        placeholder="Name"
                        required
                        value={newTopic.name}
                        onChange={handleChange}
                    />
                    <label
                        htmlFor="Description"
                        className="mb-4 block mt-5 font-bold text-gray-700"
                    >
                        Description
                    </label>
                    <input
                        type="text"
                        id="description"
                        className="focus:border-green-500 focus:outline-none rounded-2xl text-sm border py-2 block w-full mt-1 px-3"
                        placeholder="Description"
                        name="description"
                        value={newTopic.description}
                        onChange={handleChange}
                    />

                    {/* <label
                            htmlFor="Image"
                            className="mb-4 block mt-5 font-bold text-gray-700"
                        >
                            Image
                        </label>
                        <input
                            type="file"
                            id="image"
                            className="focus:border-green-500 focus:outline-none rounded border text-sm py-2 block w-full mt-1 px-3"
                            placeholder="Image URL"
                            name="image"
                            onChange={handleImageChange}
                        /> */}
                    <div className="mt-10 flex justify-between px-20">
                        <button type="submit" id='create' className="rounded-3xl bg-blue-300 px-5 py-2">
                            Create
                        </button>
                        <button
                            type="button"
                            className="rounded-3xl bg-red-300 px-5 py-2"
                            onClick={() => {
                                window.location.href = '/';
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Topic;
