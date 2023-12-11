import React from "react";
import "./Heart.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

interface HeartProps {
  count: number;
}

const Heart: React.FC<HeartProps> = ({ count }) => {
  const hearts = Array.from({ length: count }, (_, index) => index + 1);
  return (
    <div className="w-[150px] h-[80px] flex items-start fixed top-3 left-8">
      {hearts.map((heart) => (
        <div key={heart} className={`heart heart-${heart}`}>
          <FontAwesomeIcon icon={faHeart} style={{ color: "#f01461" }} />
        </div>
      ))}
    </div>
  );
};

export default Heart;
