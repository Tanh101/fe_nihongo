import Navbar from "../../components/Navbar/Navbar";
import { FlashCardDeck } from "../../components/Definition";
import FlashCard from "../../components/FlashCard/FlashCard";
import "./LearnFlashCardPage.scss";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserAvatar from "../../assets/default_user.png";
import { useNavigate } from "react-router-dom";
import ShibaLogo from "../../assets/shibalogo.jpg";
import {
  faArrowRight,
  faArrowLeft,
  faClone,
  faPen,
  faDownload,
  faFileExcel,
  faFilePdf,
  faFileWord,
  faEllipsis,
} from "@fortawesome/free-solid-svg-icons";
import { Tooltip, Dropdown, Progress } from "antd";
import type { MenuProps } from "antd";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  AlignmentType,
  BorderStyle,
  VerticalAlign,
  ShadingType,
  ImageRun,
} from "docx";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const LearnFlashCardPage = () => {
  const navigate = useNavigate();
  const [currentCard, setCurrentCard] = useState(0);
  const { flashCardDeckId } = useParams();
  const [showCard, setShowCard] = useState(false);
  const [isFirst, setIsFirst] = useState(true);
  const [isLast, setIsLast] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [toolTipIndex, setToolTipId] = useState<number>(-1);
  const [exportButtonClicked, setExportButtonClicked] = useState(false);
  const [proggress, setProgress] = useState(0);

  const handleCopyClick = async (textToCopy: string, toolTipIndex: number) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsOpened(true);
      setToolTipId(toolTipIndex);
      setTimeout(() => {
        setIsOpened(false);
      }, 1200);
    } catch (err) {
      console.error("Unable to copy text: ", err);
    }
  };

  const [flashCardDeck, setFlashCardDeck] = useState<FlashCardDeck>({
    id: "",
    name: "",
    description: "",
    flashCardInstances: [],
  });

  useEffect(() => {
    const deckId = flashCardDeckId as string;
    const storedFlashcardDecks = JSON.parse(
      localStorage.getItem("flashcard") || "[]"
    );

    const selectedDeck = storedFlashcardDecks.find(
      (deck: FlashCardDeck) => deck.id === deckId
    );

    if (selectedDeck) {
      setFlashCardDeck(selectedDeck);
      setShowCard(true);
    } else {
      console.error(`Flashcard deck with id ${deckId} not found.`);
    }
  }, [flashCardDeckId]);

  const handleNext = () => {
    if (currentCard < flashCardDeck.flashCardInstances.length - 1) {
      setCurrentCard((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentCard > 0) {
      setCurrentCard((prev) => prev - 1);
    }
  };

  useEffect(() => {
    setProgress(currentCard + 1);
  }, [currentCard]);

  useEffect(() => {
    if (currentCard === 0) {
      setIsFirst(true);
    } else {
      setIsFirst(false);
    }
    if (currentCard === flashCardDeck.flashCardInstances.length - 1) {
      setIsLast(true);
    } else {
      setIsLast(false);
    }
  }, [currentCard, flashCardDeck.flashCardInstances.length]);

  const handleEditClick = () => {
    navigate(`/edit_flashcard/${flashCardDeckId}`);
  };

  const exportExcelFile = () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Flashcards");

    // Set worksheet properties
    sheet.properties.defaultRowHeight = 40;
    sheet.views = [{ state: "frozen", ySplit: 1 }]; // Freeze the header row

    // Define columns with headers and key fields
    sheet.columns = [
      { header: "Word", key: "word", width: 20 },
      { header: "Definition", key: "definition", width: 50 },
    ];

    // Apply styles to the header row
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true, size: 20, color: { argb: "FFFFFFFF" } };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1F4E78" }, // Dark Blue fill
    };
    headerRow.alignment = { vertical: "middle", horizontal: "center" };

    // Add flashcard data to the worksheet
    flashCardDeck.flashCardInstances.forEach((flashcard) => {
      const row = sheet.addRow({
        word: flashcard.word,
        definition: flashcard.definition,
      });

      // Apply styles to each row
      row.font = { name: "Calibri", size: 18 };
      row.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      };
      row.border = {
        top: { style: "thin", color: { argb: "FF000000" } },
        left: { style: "thin", color: { argb: "FF000000" } },
        bottom: { style: "thin", color: { argb: "FF000000" } },
        right: { style: "thin", color: { argb: "FF000000" } },
      };
    });

    // Write the workbook to a buffer and then convert it to a Blob
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(blob, `Shiba Sensei ${flashCardDeck.name} Flashcards.xlsx`);
    });
    setExportButtonClicked(false);
  };

  const exportPdfFile = () => {
    fetch("/Fonts/Noto_Sans_JP/static/NotoSansJP-Regular.ttf")
      .then((response) => response.arrayBuffer())
      .then((font) => {
        const fontData = arrayBufferToBase64(font);
        pdfMake.fonts = {
          NotoSansJP: {
            normal: "NotoSansJP-Regular.ttf",
            bold: "NotoSansJP-Regular.ttf",
            italics: "NotoSansJP-Regular.ttf",
            bolditalics: "NotoSansJP-Regular.ttf",
          },
        };
        pdfMake.vfs["NotoSansJP-Regular.ttf"] = fontData;

        const myTableLayouts = {
          myCustomLayout: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            hLineWidth: function (i: number, node: any) {
              return i === 0 || i === node.table.body.length ? 2 : 1;
            },
            vLineWidth: function () {
              return 1;
            },
            hLineColor: function (i: number) {
              return i === 0 || i === 1 ? "black" : "#bbb";
            },
            vLineColor: function () {
              return "#bbb";
            },
            fillColor: function (rowIndex: number) {
              return rowIndex === 0 ? "#3b82f6" : "white";
            },
            color: function (rowIndex: number) {
              return rowIndex === 0 ? "#ffffff" : "#000000";
            },
            paddingTop: function (i: number) {
              return i === 0 ? 0 : 3;
            },
            paddingBottom: function (i: number) {
              return i === 0 ? 0 : 3;
            },
            alignment: function () {
              return "center";
            },
          },
        };

        const docDefinition = {
          content: [
            { text: `${flashCardDeck.name} Flashcards`, fontSize: 20 },
            {
              table: {
                headerRows: 1,
                widths: [200, 200],
                body: buildTableBody(flashCardDeck.flashCardInstances),
              },
              layout: "myCustomLayout",
            },
          ],
          defaultStyle: {
            font: "NotoSansJP",
            fontSize: 16,
          },
        };

        pdfMake
          .createPdf(docDefinition, myTableLayouts)
          .download(`Shiba Sensei ${flashCardDeck.name} Flashcards.pdf`);
      });
    setExportButtonClicked(false);
  };

  function arrayBufferToBase64(buffer: ArrayBuffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  function buildTableBody(data: { word: string; definition: string }[]) {
    const body: string[][] = [];

    body.push(["Word", "Definition"]);

    data.forEach((flashcard) => {
      body.push([flashcard.word, flashcard.definition]);
    });

    return body;
  }

  const exportWordFile = async () => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // Add deck name as heading
            new Table({
              columnWidths: [3500, 3500],
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      width: {
                        size: 3500,
                        type: WidthType.DXA,
                      },
                      children: [
                        new Paragraph({
                          children: [
                            new ImageRun({
                              data: await fetch(ShibaLogo).then((response) =>
                                response.arrayBuffer()
                              ),
                              transformation: {
                                width: 100,
                                height: 100,
                              },
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      borders: {
                        top: { style: BorderStyle.NONE },
                        right: { style: BorderStyle.NONE },
                        bottom: { style: BorderStyle.NONE },
                        left: { style: BorderStyle.NONE },
                      },
                    }),
                    new TableCell({
                      width: {
                        size: 3500,
                        type: WidthType.DXA,
                      },
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Shiba Sensei",
                              bold: true,
                              size: 48,
                              color: "2E3856",
                              font: "Calibri",
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      borders: {
                        top: { style: BorderStyle.NONE },
                        right: { style: BorderStyle.NONE },
                        bottom: { style: BorderStyle.NONE },
                        left: { style: BorderStyle.NONE },
                      },
                    }),
                  ],
                }),
              ],
              width: {
                size: 100, // Adjust the width as needed
                type: WidthType.PERCENTAGE,
              },
              borders: {
                top: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
              },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "\n",
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "\n",
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "\n",
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "\n",
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "\n",
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: `${flashCardDeck.name} flashcards`,
                  bold: true,
                  size: 40,
                  font: "Calibri",
                }),
              ],
            }),
            // Add flashcards table with custom column widths
            new Paragraph({
              children: [
                new TextRun({
                  text: "\n",
                }),
              ],
            }),
            new Table({
              columnWidths: [5505, 5505], // Adjust the widths as needed
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      width: {
                        size: 5505,
                        type: WidthType.DXA,
                      },
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Word",
                              bold: true,
                              size: 36,
                              color: "FFFFFF",
                              font: "Calibri",
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      shading: {
                        type: ShadingType.CLEAR,
                        fill: "3b82f6", // This is a light gray color
                      },
                    }),
                    new TableCell({
                      width: {
                        size: 5505,
                        type: WidthType.DXA,
                      },
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Definition",
                              bold: true,
                              size: 36,
                              color: "FFFFFF",
                              font: "Calibri",
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                        }),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      shading: {
                        type: ShadingType.CLEAR,
                        fill: "3b82f6", // This is a light gray color
                      },
                    }),
                  ],
                }),
                ...flashCardDeck.flashCardInstances.map(
                  (flashcard) =>
                    new TableRow({
                      children: [
                        new TableCell({
                          width: {
                            size: 5505,
                            type: WidthType.DXA,
                          },
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: flashcard.word,
                                  bold: true,
                                  size: 28,
                                  color: "2E3856",
                                  font: "Calibri",
                                }),
                              ],
                              alignment: AlignmentType.CENTER,
                            }),
                          ],
                          verticalAlign: VerticalAlign.CENTER,
                        }),
                        new TableCell({
                          width: {
                            size: 5505,
                            type: WidthType.DXA,
                          },
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: flashcard.definition,
                                  bold: true,
                                  size: 28,
                                  color: "2E3856",
                                  font: "Calibri",
                                }),
                              ],
                              alignment: AlignmentType.CENTER,
                            }),
                          ],
                          verticalAlign: VerticalAlign.CENTER,
                        }),
                      ],
                    })
                ),
              ],
              borders: {
                top: { style: BorderStyle.SINGLE },
                right: { style: BorderStyle.SINGLE },
                bottom: { style: BorderStyle.SINGLE },
                left: { style: BorderStyle.SINGLE },
              },
            }),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `Shiba Sensei ${flashCardDeck.name} Flashcards.docx`);
    });
    setExportButtonClicked(false);
  };

  const handleExportFile = () => {
    setExportButtonClicked(!exportButtonClicked);
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <button
          className=" h-[30px] text-xs font-semibold text-[#10b981]"
          onClick={exportExcelFile}
        >
          Excel File &nbsp;&nbsp;&nbsp;
          <FontAwesomeIcon icon={faFileExcel} className="text-emerald-500" />
        </button>
      ),
    },
    {
      key: "2",
      label: (
        <button
          className="h-[30px] text-xs font-semibold text-[#f59e0b]"
          onClick={exportPdfFile}
        >
          PDF File &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <FontAwesomeIcon icon={faFilePdf} className="text-amber-500" />
        </button>
      ),
    },
    {
      key: "3",
      label: (
        <button
          className="h-[30px] text-xs font-semibold text-[#3b82f6]"
          onClick={exportWordFile}
        >
          Word File &nbsp;&nbsp;&nbsp;
          <FontAwesomeIcon icon={faFileWord} className="text-blue-500" />
        </button>
      ),
    },
  ];

  return (
    <div className="learn_flashcard_page_container w-full h-full bg-[#F6F7FB]">
      <Navbar active_category="flashcard" />
      <div className="learn_flashcard_page_content overflow-y-scroll flex flex-col items-center justify-start">
        <div className="learn_flashcard_page_title_container">
          <p className="learn_flashcard_page_title text-[32px] font-bold text-[#2E3856] text-center">
            {flashCardDeck.name}
          </p>
        </div>
        <div className="learn_flashcard_page_content_container flex flex-col justify-start items-center mt-2">
          {showCard ? (
            <FlashCard deck={flashCardDeck} currentCard={currentCard} />
          ) : null}
          <div className="learn_flashcard_page_button_container w-full h-[80px] flex flex-row justify-center items-center mt-4">
            <button
              className={`${
                isFirst
                  ? " cursor-default bg-[#F6F7FB] border-2 border-solid border-[#d6dbe6] "
                  : "bg-white border-2 border-solid border-violet-500 hover:bg-violet-100"
              } learn_flashcard_page_previous_button w-[60px] h-[60px] rounded-full text-white font-semibold text-[18px] `}
              onClick={handlePrevious}
            >
              <FontAwesomeIcon
                icon={faArrowLeft}
                style={{ color: isFirst ? "#e7eaf2" : "#8b5cf6" }}
              />
            </button>
            <p className="progress_text text-semibold text-[#2E3856] text-xl mx-[30px]">
              {currentCard + 1} / {flashCardDeck.flashCardInstances.length}
            </p>
            <button
              className={`${
                isLast || flashCardDeck.flashCardInstances.length === 1
                  ? "cursor-default bg-[#F6F7FB] border-2 border-solid border-[#d6dbe6]"
                  : "bg-white border-2 border-solid border-violet-500 hover:bg-violet-100"
              } learn_flashcard_page_next_button w-[60px] h-[60px] rounded-full text-white font-semibold text-[18px] `}
              onClick={handleNext}
            >
              <FontAwesomeIcon
                icon={faArrowRight}
                style={{
                  color:
                    isLast || flashCardDeck.flashCardInstances.length === 1
                      ? "#e7eaf2"
                      : "#8b5cf6",
                }}
              />
            </button>
          </div>
          <div className="lesson_page_question_counter w-[80%] h-16 flex flex-row justify-center items-center text-xl font-semibold">
            <Progress
              percent={Math.round(
                (proggress / flashCardDeck.flashCardInstances.length) * 100
              )}
              showInfo={false}
              strokeColor={"#c4b5fd"}
              strokeWidth={3}
            />
          </div>
        </div>
        <div className="learn_flashcard_page_description_container w-[50%] h-[300px] flex flex-col justify-center items-start mt-4 mb-32">
          <div className="learn_flashcard_page_description_title w-full h-[150px] flex flex-row justify-between items-center">
            <div className="creator_info w-[350px] h-[100px] flex flex-row justify-start items-center">
              <img src={UserAvatar} className="user_avatar" />
              <div className="w-[100px] h-[100%] flex flex-col justify-center items-start ml-4">
                <p className="creater_name_title text-xs font-normal text-[#9FA7BE]">
                  Created by
                </p>
                <p className="creator_name text-[17px] font-medium text-[#2E3856]">
                  Username
                </p>
              </div>
            </div>
            <div className="action_container w-[55%] h-[70px] flex flex-row items-center justify-end">
              <Dropdown
                menu={{ items }}
                placement="top"
                arrow={{ pointAtCenter: true }}
                open={exportButtonClicked}
              >
                <button
                  className="learn_flashcard_page_description_export_button w-[108px] h-[48px] rounded-lg hover:bg-violet-100 border-2 border-solid border-violet-200 text-xs font-semibold text-[#2E3856] mr-2"
                  onClick={handleExportFile}
                >
                  Download &nbsp;
                  <FontAwesomeIcon
                    icon={faDownload}
                    className="text-violet-500 text-[15px]"
                  />
                </button>
              </Dropdown>
              <button
                className="learn_flashcard_page_description_copy_button w-[48px] h-[48px] rounded-lg hover:bg-violet-100 border-2 border-solid border-violet-200 mr-2"
                onClick={handleEditClick}
              >
                <FontAwesomeIcon icon={faPen} className="text-violet-500" />
              </button>

              <button
                className="learn_flashcard_page_description_copy_button w-[48px] h-[48px] rounded-lg hover:bg-violet-100 border-2 border-solid border-violet-200"
                onClick={handleEditClick}
              >
                <FontAwesomeIcon
                  icon={faEllipsis}
                  className="text-violet-500"
                />
              </button>
            </div>
          </div>
          <div className="learn_flashcard_page_description_info w-full h-auto">
            <p className="learn_flashcard_page_description_text w-full h-auto text-[16px] font-normal text-[#2E3856] tracking-wide">
              {flashCardDeck.description}
            </p>
          </div>
        </div>
        <div className="w-full h-[50px] mb-8">
          <p className="flash_card_collection_title text-[20px] font-semibold text-[#2E3856] text-center">
            Words in this set ({flashCardDeck.flashCardInstances.length})
          </p>
        </div>
        <div className="flash_card_collection w-[55%]">
          {flashCardDeck.flashCardInstances.map((flashCard, index) => {
            return (
              <div
                key={index}
                className="flash_card_collection_item w-full h-[100px] rounded-[12px] bg-white mb-4 flex flex-row justify-start items-center"
              >
                <p className="flash_card_collection_item_text w-[35%] text-[#2E3856] text-[22px] font-semibold text-center mr-8 ml-8 border-r-2 border-solid border-[#e2e8f0] ">
                  {flashCard.word}
                </p>
                <p className="flash_card_collection_item_text w-[35%] text-[#2E3856] text-[18px] font-semibold text-start ml-28">
                  {flashCard.definition}
                </p>
                <Tooltip
                  title="Copied!"
                  trigger={"click"}
                  placement="top"
                  open={isOpened && toolTipIndex === index}
                  arrow={{ pointAtCenter: true }}
                >
                  <button
                    className="flash_card_collection_item_copy_button w-[50px] h-[50px] rounded-full hover:bg-violet-100 ml-[10px]"
                    onClick={() => handleCopyClick(flashCard.word, index)}
                  >
                    <FontAwesomeIcon
                      icon={faClone}
                      className="text-violet-500"
                      size="xl"
                    />
                  </button>
                </Tooltip>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LearnFlashCardPage;
