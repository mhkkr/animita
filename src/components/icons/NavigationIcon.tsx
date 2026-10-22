import React from "react";
import {
  MdClose,
  MdArrowBack,
  MdArrowDropDown,
  MdArrowDropUp,
  MdMoreHoriz,
  MdList,
  MdPlayArrow,
  MdOutlinePlayArrow,
  MdPerson,
  MdOutlinePerson,
  MdSettings,
  MdOutlineSettings,
  MdHistory,
  MdOutlineHistory,
  MdCalendarMonth,
} from "react-icons/md";

type Props = React.ComponentPropsWithoutRef<"svg">;

export default function NavigationIcon(props: Props) {
  switch (props.id) {
    case "close": return <MdClose {...props} />;
    case "arrow_back": return <MdArrowBack {...props} />;
    case "arrow_drop_down": return <MdArrowDropDown {...props} />;
    case "arrow_drop_up": return <MdArrowDropUp {...props} />;
    case "more_horiz": return <MdMoreHoriz {...props} />;
    case "list": return <MdList {...props} />;
    case "play": return <MdPlayArrow {...props} />;
    case "play_outline": return <MdOutlinePlayArrow {...props} />;
    case "person": return <MdPerson {...props} />;
    case "person_outline": return <MdOutlinePerson {...props} />;
    case "settings": return <MdSettings {...props} />;
    case "settings_outline": return <MdOutlineSettings {...props} />;
    case "history": return <MdHistory {...props} />;
    case "history_outline": return <MdOutlineHistory {...props} />;
    case "calendar": return <MdCalendarMonth {...props} />;
  }
  return <></>;
}