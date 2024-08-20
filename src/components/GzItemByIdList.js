import { useStoreState, useStoreActions } from "easy-peasy";
import { useParams } from "react-router-dom";
import { base32 } from "@scure/base";
import { inflate } from "pako";
import configData from "../config.json";
import ProgramList from "./ProgramList";

const ItemByIdList = () => {
  const { addSelection } = useStoreActions((actions) => ({
    addSelection: actions.addSelection,
  })); 

  const params = useParams();
  const gzids = base32.decode(params.idList.replaceAll("-","="));
  const rawList = inflate(gzids, {to: 'string'});
  console.log(rawList);
  const itemIds = rawList.split("~");
  const program = useStoreState((state) => state.program);
  if (program.length === 0) return <></>;

  // Filter to select only the specified ID.
  const filteredProgram = program.filter((item) =>
    itemIds.includes(item.id.toString())
  );
  return (
    <div>
      <div className="page-heading">
        <h2>{configData.PROGRAM.SHARED.TITLE}</h2>
      </div>
      <div className="page-body">{configData.PROGRAM.SHARED.DESCRIPTION}</div>
      <ProgramList program={filteredProgram} />
      <div className="buttons">
        <button
          className="button-add-all"
          onClick={() => {
            itemIds.forEach((id) => {
              addSelection(id);
            });
          }}
        >
          {configData.PROGRAM.SHARED.BUTTON_LABEL}
        </button>
      </div>
    </div>
  );
};

export default ItemByIdList;
