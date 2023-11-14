import React, { useEffect, useState } from "react";
import { Avatar, Button, List, Skeleton } from "antd";
import "./PracticePage.scss";
import Navbar from "../../components/Navbar/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

interface DataType {
  gender?: string;
  name: {
    title?: string;
    first?: string;
    last?: string;
  };
  email?: string;
  picture: {
    large?: string;
    medium?: string;
    thumbnail?: string;
  };
  nat?: string;
  loading: boolean;
}

const count = 10;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat,picture&noinfo`;
function PracticePage() {
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DataType[]>([]);
  const [list, setList] = useState<DataType[]>([]);

  useEffect(() => {
    fetch(fakeDataUrl)
      .then((res) => res.json())
      .then((res) => {
        setInitLoading(false);
        setData(res.results);
        setList(res.results);
      });
  }, []);

  const onLoadMore = () => {
    setLoading(true);
    setList(
      data.concat(
        [...new Array(count)].map(() => ({
          loading: true,
          name: {},
          picture: {},
        }))
      )
    );
    fetch(fakeDataUrl)
      .then((res) => res.json())
      .then((res) => {
        const newData = data.concat(res.results);
        setData(newData);
        setList(newData);
        setLoading(false);
        window.dispatchEvent(new Event("resize"));
      });
  };

  const loadMore =
    !initLoading && !loading ? (
      <div
        style={{
          textAlign: "center",
          marginTop: 12,
          height: 32,
          lineHeight: "32px",
        }}
      >
        <Button onClick={onLoadMore}>Load more</Button>
      </div>
    ) : null;
  return (
    <div className="page_container">
      <Navbar active_category="practice"></Navbar>
      <div className="practice_page_content overflow-y-scroll">
        <div className="practice_page_title_container items-center">
          <p className="practice_page_title text-3xl font-semibold text-black text-center">
            Practice Lessons
          </p>
        </div>
        <div className="practice_list">
          <List
            className="demo-loadmore-list"
            loading={initLoading}
            itemLayout="horizontal"
            loadMore={loadMore}
            dataSource={list}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <button className="learn_button bg-purple-500 text-white w-28 h-8 min-w-min rounded-2xl hover:bg-purple-700 active:">
                    <p className="font-semibold">
                      Practice&ensp; <FontAwesomeIcon icon={faPenToSquare} />
                    </p>
                  </button>,
                ]}
              >
                <Skeleton avatar title={false} loading={item.loading} active>
                  <List.Item.Meta
                    avatar={<Avatar src={item.picture.large} size={58} />}
                    title={<p>{item.name.first}</p>}
                    description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                  />
                </Skeleton>
              </List.Item>
            )}
          />
        </div>
      </div>
    </div>
  );
}

export default PracticePage;
