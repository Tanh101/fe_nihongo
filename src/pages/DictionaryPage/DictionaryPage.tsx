import "./DictionaryPage.scss";
import Navbar from "../../components/Navbar/Navbar";
import WordSearch from "../../components/WordSearch/WordSearch";

function DictionaryPage() {
  return (
    <div className="page_container">
      {/* <LoadingShiba /> */}

      <Navbar active_category="search_word" />
      <div className="search_word_page_content bg-[#F6F7FB]">
        <WordSearch input="" />
      </div>
    </div>
  );
}

export default DictionaryPage;
