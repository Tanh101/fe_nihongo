import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import WordSearch from '../../components/WordSearch/WordSearch'
import './WordDetailPage.scss'
import customAxios from '../../api/AxiosInstance';
import { useEffect, useState } from 'react';
import { Word } from '../../components/Definition';

function WordDetailPage() {
    const { word } = useParams();
    const [wordData, setWordData] = useState<Word | null>(null);

    const fetchData = async () => {
        await customAxios.get(`/words/${word}`)
            .then(res => {
                console.log(res.data.data);
                setWordData(res.data.data);
            })
            .catch(err => {
                console.log(err);
            })
    }

    useEffect(() => {
        fetchData();
    }, [word]);

    return (
        <div className='page_container'>
            <Navbar active_category="search_word" />
            <div className='word_detail_page_content bg-gray-100'>
                <WordSearch input={word} />

                {wordData && (
                    <div className='rounded p-5 bg-white mt-5 border border-gray-300 w-3/5'>
                        <h2 className='text-red-500 text-2xl font-bold mb-2'>{wordData?.word}</h2>
                        <div className='flex flex-row'>
                            <span className='text-gray-500 text-lg'>{wordData?.pronunciation}</span>
                            <span className='text-gray-500 text-lg'>「{wordData?.sino_vietnamese.toUpperCase()}」</span>
                        </div>
                        <div className='mt-5'>
                            {wordData?.means.map((item, index) => (
                                <div className='mt-5' key={index}>
                                    <h3 key={index} className='text-violet-500 text-lg font-semibold'>◆ {item.meaning}</h3>
                                    <p className='text-red-500 text-lg mx-5 mt-2'>{item.example}</p>
                                    <p className='text-gray-500 text-lg mx-5'>{item.example_meaning}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className='rounded p-5 bg-white my-5 border border-gray-300 w-3/5'>
                    <div>
                        <h2 className='text-gray-500 text-xl font-bold mb-2'>Comments</h2>
                        <div className='flex flex-row'>
                            <img src='https://picsum.photos/200' className='w-10 h-10 rounded-full' />
                            <textarea className='focus:ring-violet-500 focus:border-violet-500 border border-gray-300 rounded w-full h-20 ml-3 p-2' placeholder='Write your comment here...'></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WordDetailPage;
