import React, {  useEffect, useState } from 'react';
import { Toastify } from '../../../toastify/Toastify';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import customAxios from '../../../api/AxiosInstance';
import { useNavigate } from "react-router-dom";
import Navbar from './Navbar';

interface Lesson {
    title: string;
    description: string;
}

function Lesson() {
    const navigate = useNavigate();

    const [newLesson, setNewLesson] = useState<Lesson>({
        title: 'Lesson 1',
        description: 'Lesson 1 Description'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewLesson({
            ...newLesson,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', newLesson.title);
        formData.append('description', newLesson.description);

        customAxios.put('http://127.0.0.1:8000/api/test/lessons/1', formData)
            .then((response) => {
                if (response.status === 200) {
                    Toastify.success(response.data.message);
                    navigate("/learn");
                }
            })
            .catch((error) => {
                toast.error(error.response.data.message);
                if (error.response.status === 400) {
                    if (error.response.data.errors.title) {
                        toast.error(error.response.data.errors.title[0]);
                    }
                    if (error.response.data.errors.description) {
                        toast.error(error.response.data.errors.description[0]);
                    }
                    if(error.response.data.message){
                        toast.error(error.response.data.message);
                    }
                } else {
                    toast.error("Unexpected error:", error.response.data);
                }
            });
    };

    useEffect(() => {
        customAxios.get(`http://127.0.0.1:8000/api/test/lessons/1`)
            .then((response) => {
                const lessonData: Lesson = response.data.lesson; 
                setNewLesson(lessonData);
            })
            .catch((error) => {
                console.error('Error fetching lesson:', error);
            });
    }, []);

    return (
        <div>
            <Navbar></Navbar>
            <div className="flex justify-center items-center h-screen text-lg bg-slate-300">
                <form onSubmit={handleSubmit} className="">
                    <div className="form w-[556px] py-16 px-16 bg-white shadow-lg rounded-3xl">
                        <label
                            htmlFor="title"
                            className="login-label mb-4 block font-bold text-gray-700"
                        >
                            Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            className="focus:border-green-500 focus:outline-none block w-full rounded-2xl text-sm border py-2 mt-1 px-3"
                            name="title"
                            placeholder="Title"
                            required
                            value={newLesson.title}
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
                            value={newLesson.description}
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
                            <button type="submit" id='update' className="rounded-3xl bg-blue-300 px-5 py-2">
                                Update
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
        </div>
    );
}

export default Lesson;
