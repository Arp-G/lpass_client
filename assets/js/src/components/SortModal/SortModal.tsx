import React, { Dispatch, SetStateAction, FC, ChangeEvent } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { SortOrder } from '../../Types/Types';

interface Props {
  setSortModal: Dispatch<SetStateAction<boolean>>,
  setSortOrder: Dispatch<SetStateAction<SortOrder>>,
  sortOrder: SortOrder
}

const SortModal: FC<Props> = ({ setSortModal, setSortOrder, sortOrder }) => {
  const handleSortOrderChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSortOrder(event.target.value as SortOrder);
  }
  return (
    <div className="modal fixed w-full h-full top-0 left-0 flex items-center">
      <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
      <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
        <div className="modal-content m-2 flex flex-col justify-center border-2">
          <div className="flex flex-row">
            <div className="text-lg font-semibold italic ml-4">
              Sort order
            </div>
            <AiOutlineCloseCircle
              className="text-2xl mt-1 mr-1 ml-auto cursor-pointer"
              onClick={() => setSortModal(false)}
            />
          </div>
          <div className="flex">
            <section className="w-1/2 p-2">
              <input
                type="radio"
                value="A-Z"
                name="sort_order"
                id="sort-alphabetically"
                className="m-2 font-semibold italic"
                checked={'A-Z' === sortOrder}
                onChange={handleSortOrderChange}
              />
              <label htmlFor="sort-alphabetically"> Alphabetically </label>
            </section>

            <section className="w-1/2 p-2">
              <input
                type="radio"
                value="TIME"
                name="sort_order"
                id="sort-time"
                className="m-2 font-semibold italic"
                checked={'TIME' === sortOrder}
                onChange={handleSortOrderChange}
              />
              <label htmlFor="sort-time"> Latest first </label>
            </section>
          </div>
        </div>
      </div>
    </div>);
}

export default SortModal;
