import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import WordSearch from '../../components/WordSearch/WordSearch'
import './WordDetailPage.scss'

function WordDetailPage() {
    const { word } = useParams();

    console.log(word);
    
    const fetchData = async () => {

    }

    return (
        <div className='page_container'>
            <Navbar active_category="search_word" />
            <div className='word_detail_page_content bg-gray-100'>
                <WordSearch input={word}/>
            </div>

            <div className=''>

            </div>
        </div>
    )
}

export default WordDetailPage;
