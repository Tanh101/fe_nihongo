/* eslint-disable react-hooks/exhaustive-deps */
import Navbar from "../../components/Navbar/Navbar";
import { FlashCardDeck } from "../../components/Definition";
import FlashCard from "../../components/FlashCard/FlashCard";
import "./LearnFlashCardPage.scss";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserAvatar from "../../assets/default_user.png";
import { useNavigate } from "react-router-dom";
import ShibaGangster from "../../assets/shiba_gangster.png";
import LoadingShiba from "../../components/Loading/LoadingShiba";
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
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { Tooltip, Dropdown, Progress, Modal } from "antd";
import type { MenuProps } from "antd";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import pdfMake from "pdfmake/build/pdfmake";
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
import { Toastify } from "../../toastify/Toastify";
import Logo from "../../assets/shibalogo.jpg";
import TextLogo from "../../assets/shiba_sensei_logo.png";
import customAxios from "../../api/AxiosInstance";
import { useAppSelector } from "../../redux/store";

pdfMake.vfs =
  pdfFonts && pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : globalThis.pdfMake.vfs;

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
  const [moreButtonClicked, setMoreButtonClicked] = useState(false);
  const [deleteButtonClicked, setDeleteButtonClicked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [flashCardDeck, setFlashCardDeck] = useState<FlashCardDeck>({
    id: "",
    name: "",
    description: "",
    cards: [],
    word_count: 0,
  });
  const user = useAppSelector((state) => state.user);

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

  async function getFlashCardDeck() {
    const access_token = localStorage.getItem("access_token");
    const refresh_token = localStorage.getItem("refresh_token");
    if (!access_token && !refresh_token) {
      navigate("/login");
    }
    await customAxios.get("/flashcard/" + flashCardDeckId).then((res) => {
      setFlashCardDeck(res.data.flashcard);
      setLoading(false);
      setShowCard(true);
    });
  }

  useEffect(() => {
    getFlashCardDeck();
  }, []);

  const handleNext = () => {
    if (currentCard < flashCardDeck.cards.length - 1) {
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
    if (currentCard === flashCardDeck.cards.length - 1) {
      setIsLast(true);
    } else {
      setIsLast(false);
    }
  }, [currentCard, flashCardDeck?.cards?.length]);

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
    flashCardDeck.cards.forEach((flashcard) => {
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
        getBase64Image(Logo, function (base64Image1) {
          getBase64Image(TextLogo, function (base64Image2) {
            const docDefinition = {
              content: [
                {
                  table: {
                    widths: ["45%", "55%"],
                    body: [
                      [
                        {
                          image: base64Image1,
                          width: 95,
                          height: 110,
                          alignment: "right",
                        },
                        {
                          table: {
                            widths: ["*"],
                            body: [
                              [{ text: ``, fontSize: 20 }],
                              [
                                {
                                  image: base64Image2,
                                  width: 190,
                                  height: 50,
                                  alignment: "left",
                                  margin: [0, 20, 0, 20],
                                },
                              ],
                              [{ text: ``, fontSize: 20 }],
                            ],
                          },
                          layout: "noBorders",
                        },
                      ],
                    ],
                  },
                  layout: "noBorders",
                },
                { text: `\n\n\n`, fontSize: 20 },
                {
                  table: {
                    widths: ["*"],
                    body: [
                      [
                        {
                          text: `${flashCardDeck.name} Flashcards`,
                          fontSize: 20,
                          alignment: "center",
                        },
                      ],
                    ],
                  },
                  layout: "noBorders",
                },
                { text: `\n`, fontSize: 20 },
                {
                  table: {
                    headerRows: 1,
                    widths: [248, 248],
                    body: buildTableBody(flashCardDeck.cards),
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
        });
      });
    setExportButtonClicked(false);
  };
  function getBase64Image(imgUrl: string, callback: (value: string) => void) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      const reader = new FileReader();
      reader.onloadend = function () {
        if (reader.result !== null) {
          callback(reader.result as string);
        }
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open("GET", imgUrl);
    xhr.responseType = "blob";
    xhr.send();
  }

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
    const body: Array<
      Array<{ text: string; alignment: string; color: string; bold: boolean }>
    > = [];

    body.push([
      { text: "Word", alignment: "center", color: "white", bold: true },
      { text: "Definition", alignment: "center", color: "white", bold: true },
    ]);

    data.forEach((flashcard) => {
      body.push([
        {
          text: flashcard.word,
          alignment: "center",
          color: "black",
          bold: true,
        },
        {
          text: flashcard.definition,
          alignment: "center",
          color: "black",
          bold: true,
        },
      ]);
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
                              data: await fetch(Logo).then((response) =>
                                response.arrayBuffer()
                              ),
                              transformation: {
                                width: 95,
                                height: 110,
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
                            new ImageRun({
                              data: await fetch(TextLogo).then((response) =>
                                response.arrayBuffer()
                              ),
                              transformation: {
                                width: 190,
                                height: 50,
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
                  ],
                }),
              ],
              width: {
                size: 100,
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
                ...flashCardDeck.cards.map(
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

  const deleteFlashcardDeck = async (deckId: string) => {
    await customAxios.delete("/flashcard/" + deckId).then((res) => {
      if (res.status === 200) {
        Toastify.info(
          `Flashcard deck "${flashCardDeck.name}" has been deleted !`
        );
        navigate("/flashcard");
      }
    });
  };

  const handleExportFile = () => {
    setMoreButtonClicked(false);
    setExportButtonClicked(!exportButtonClicked);
  };

  const handleMoreButtonClick = () => {
    setExportButtonClicked(false);
    setMoreButtonClicked(!moreButtonClicked);
  };

  const handleModalCancel = () => {
    setDeleteButtonClicked(false);
  };

  const handleDeleteButtonClicked = () => {
    setDeleteButtonClicked(true);
    setMoreButtonClicked(false);
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

  const itemsMore: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <button
          className=" h-[30px] text-xs font-semibold text-[#ef4444]"
          onClick={handleDeleteButtonClicked}
        >
          Delete &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <FontAwesomeIcon icon={faTrashCan} className="text-red-500" />
        </button>
      ),
    },
  ];

  return (
    <div className="learn_flashcard_page_container w-full h-full bg-[#F6F7FB]">
      <Navbar active_category="flashcard" />
      {loading === false ? (
        <div>
          <div className="learn_flashcard_page_content overflow-y-scroll flex flex-col items-center justify-start">
            <div className="learn_flashcard_page_title_container">
              <p className="learn_flashcard_page_title text-[32px] font-bold text-[#2E3856] text-center">
                {flashCardDeck?.name}
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
                  {currentCard + 1} / {flashCardDeck?.cards?.length}
                </p>
                <button
                  className={`${
                    isLast || flashCardDeck?.cards?.length === 1
                      ? "cursor-default bg-[#F6F7FB] border-2 border-solid border-[#d6dbe6]"
                      : "bg-white border-2 border-solid border-violet-500 hover:bg-violet-100"
                  } learn_flashcard_page_next_button w-[60px] h-[60px] rounded-full text-white font-semibold text-[18px] `}
                  onClick={handleNext}
                >
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    style={{
                      color:
                        isLast || flashCardDeck?.cards?.length === 1
                          ? "#e7eaf2"
                          : "#8b5cf6",
                    }}
                  />
                </button>
              </div>
              <div className="lesson_page_question_counter w-[80%] h-16 flex flex-row justify-center items-center text-xl font-semibold">
                <Progress
                  percent={Math.round(
                    (proggress / flashCardDeck?.cards?.length) * 100
                  )}
                  showInfo={false}
                  strokeColor={"#c4b5fd"}
                  strokeWidth={3}
                />
              </div>
            </div>
            <div className="learn_flashcard_page_description_container w-[50%] h-auto max-h-[450px] flex flex-col justify-center items-start mt-4 mb-32">
              <div className="learn_flashcard_page_description_title w-full h-[150px] flex flex-row justify-between items-center ">
                <div className="creator_info w-[350px] h-[100px] flex flex-row justify-start items-center">
                  <img src={UserAvatar} className="user_avatar" />
                  <div className="w-[100px] h-[100%] flex flex-col justify-center items-start ml-4">
                    <p className="creater_name_title text-xs font-normal text-[#9FA7BE]">
                      Created by
                    </p>
                    <p className="creator_name text-[17px] font-medium text-[#2E3856]">
                      {user.user?.name}
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

                  <Tooltip
                    title="Edit"
                    trigger={"hover"}
                    placement="top"
                    arrow={{ pointAtCenter: true }}
                  >
                    <button
                      className="learn_flashcard_page_description_copy_button w-[48px] h-[48px] rounded-lg hover:bg-violet-100 border-2 border-solid border-violet-200 mr-2"
                      onClick={handleEditClick}
                    >
                      <FontAwesomeIcon
                        icon={faPen}
                        className="text-violet-500 text-[14px]"
                      />
                    </button>
                  </Tooltip>
                  <Dropdown
                    menu={{ items: itemsMore }}
                    placement="top"
                    arrow={{ pointAtCenter: true }}
                    open={moreButtonClicked}
                  >
                    <button
                      className="learn_flashcard_page_description_copy_button w-[48px] h-[48px] rounded-lg hover:bg-violet-100 border-2 border-solid border-violet-200"
                      onClick={handleMoreButtonClick}
                    >
                      <FontAwesomeIcon
                        icon={faEllipsis}
                        className="text-violet-500"
                      />
                    </button>
                  </Dropdown>
                </div>
              </div>
              <div className="learn_flashcard_page_description_info w-full h-auto max-h-[300px]">
                <p
                  className="learn_flashcard_page_description_text h-auto max-h-[200px] text-[16px] font-normal text-[#2E3856] tracking-wide overflow-auto"
                  style={{
                    overflowWrap: "anywhere",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  {flashCardDeck?.description}
                </p>
              </div>
            </div>
            <div className="w-full h-[50px] mb-8">
              <p className="flash_card_collection_title text-[20px] font-semibold text-[#2E3856] text-center">
                Words in this set ({flashCardDeck?.cards?.length})
              </p>
            </div>
            <div className="flash_card_collection w-[55%]">
              {flashCardDeck &&
                flashCardDeck?.cards?.length > 0 &&
                flashCardDeck?.cards?.map((flashCard, index) => {
                  return (
                    <div
                      key={index}
                      className="flash_card_collection_item w-full h-[100px] rounded-[12px] bg-white mb-4 flex flex-row justify-start items-center"
                    >
                      <p
                        className={
                          "flash_card_collection_item_text w-[35%] text-[#2E3856] text-[22px] font-semibold text-center mr-8 ml-8 border-r-2 border-solid border-[#e2e8f0] " +
                          (flashCard.word.length > 32
                            ? "scrollbar-thin scrollbar-thumb-violet-500 scrollbar-track-transparent flex flex-row justify-start items-start"
                            : "flex flex-row justify-center items-center")
                        }
                        style={{
                          overflowWrap: "anywhere",
                          scrollbarWidth: "none",
                          msOverflowStyle: "none",
                        }}
                      >
                        {flashCard.word}
                      </p>
                      <p
                        className={
                          "flash_card_collection_item_text w-[35%] h-[80px] text-[#2E3856] text-[18px] font-semibold text-start ml-28 overflow-auto " +
                          (flashCard.definition.length > 32
                            ? "scrollbar-thin scrollbar-thumb-violet-500 scrollbar-track-transparent flex flex-row justify-start items-start"
                            : "flex flex-row justify-start items-center")
                        }
                        style={{
                          overflowWrap: "anywhere",
                          scrollbarWidth: "none",
                          msOverflowStyle: "none",
                        }}
                      >
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
          <Modal
            okButtonProps={{
              style: {
                background: "linear-gradient(to right, #cb356b,#bd3f32)",
                width: "120px",
                height: "40px",
                fontSize: "16px",
                borderRadius: "10px",
              },
              onMouseOver: (event) => {
                event.currentTarget.style.opacity = "0.8";
                event.currentTarget.style.borderColor = "#60A5FA";
              },
              onMouseLeave: (event) => {
                event.currentTarget.style.opacity = "1";
                event.currentTarget.style.borderColor = "#ffffff";
              },
            }}
            title={
              <div className="w-full h-[50px] flex flex-row items-center justify-center text-[22px] font-semibold mt-[20px]">
                Do you want to delete this flashcard deck ?
              </div>
            }
            open={deleteButtonClicked}
            onOk={() => deleteFlashcardDeck(flashCardDeckId as string)}
            onCancel={handleModalCancel}
            closable={false}
            cancelButtonProps={{
              style: {
                width: "120px",
                height: "40px",
                fontSize: "16px",
                borderRadius: "10px",
              },
            }}
            okText="Delete"
          >
            <div className="w-full h-[300px] flex flex-col items-center justify-center mt-[80px]">
              <img
                src={ShibaGangster}
                alt="shiba cry"
                className="w-[60%] h-[300px] object-cover"
              />
              <p className="text-xl font-semibold w-full h-[20px]  text-[14px] flex flex-row items-center justify-center mb-[120px] px-5 mt-4">
                This deck will be deleted permanently
              </p>
            </div>
          </Modal>{" "}
        </div>
      ) : null}
      {loading && <LoadingShiba />}
    </div>
  );
};

export default LearnFlashCardPage;
