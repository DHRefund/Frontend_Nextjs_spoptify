import { Button, Dropdown } from "react-bootstrap";
import { usePlayer } from "@/providers/PlayerContext";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

const SortOptions = () => {
  const { sortType, sortOrder, setSortType, setSortOrder } = usePlayer();

  const getSortIcon = () => {
    if (sortOrder === "asc") return <FaSortUp />;
    return <FaSortDown />;
  };

  const handleSortOrderToggle = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="d-flex align-items-center gap-2">
      <Dropdown>
        <Dropdown.Toggle variant="dark" className="text-light-gray">
          <FaSort className="me-2" />
          {sortType === "title" && "Title"}
          {sortType === "artist" && "Artist"}
          {sortType === "createdAt" && "Date Added"}
        </Dropdown.Toggle>

        <Dropdown.Menu variant="dark">
          <Dropdown.Item active={sortType === "title"} onClick={() => setSortType("title")}>
            Title
          </Dropdown.Item>
          <Dropdown.Item active={sortType === "artist"} onClick={() => setSortType("artist")}>
            Artist
          </Dropdown.Item>
          <Dropdown.Item active={sortType === "createdAt"} onClick={() => setSortType("createdAt")}>
            Date Added
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <Button variant="dark" className="text-light-gray" onClick={handleSortOrderToggle}>
        {getSortIcon()}
      </Button>
    </div>
  );
};

export default SortOptions;
