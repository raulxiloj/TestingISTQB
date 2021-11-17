import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel
} from "@reach/accordion";
import "@reach/accordion/styles.css";

import { useAppReducer, useItems } from "../AppContext";
import Progress from "./Progress";
import AddItemForm from "./AddItemForm";
import Item from "./Item";
import styles from "./ItemList.module.scss";
import arrow from "../img/arrow.svg";
import alldone from "../img/alldone.svg";

// List of todo items
function ItemList() {
  const dispatch = useAppReducer();
  const { pending, paused, completed } = useItems();

  return (
    <div className="item-list">
      <Progress />
      <AddItemForm />
      <div data-testid='pending-list'>
        {pending.length > 0 ? (
          <>
            {pending.map(item => {
              return <Item item={item} key={item.key} />;
            })}
          </>
        ) : (
            <div className={styles.alldone}>
              <img src={alldone} alt="Nothing to do!" />
            </div>
          )}
      </div>
      <Accordion collapsible multiple>
        <div data-testid='paused-list'>
          {paused.length > 0 && (
            <AccordionItem>
              <AccordionButton className={styles.toggle}>
                <img src={arrow} alt="Do Later Toggle" />
                <span>Hacer mas tarde</span>
              </AccordionButton>
              <AccordionPanel className={styles.panel}>
                {paused &&
                  paused.map(item => {
                    return <Item item={item} key={item.key} />;
                  })}
              </AccordionPanel>
            </AccordionItem>
          )}
        </div>
        <div data-testid='completed-list'>
          {completed.length > 0 && (
            <AccordionItem>
              <AccordionButton className={styles.toggle}>
                <img src={arrow} alt="Completed Toggle" /> <span>Completado</span>
              </AccordionButton>
              <AccordionPanel className={styles.panel}>
                {completed &&
                  completed.map(item => {
                    return <Item item={item} key={item.key} />;
                  })}
              </AccordionPanel>
            </AccordionItem>
          )}
        </div>

      </Accordion>



      {(completed.length > 0 || paused.length > 0) && (
        <div className={styles.reset}>
          <button
            data-testid='reset-button'
            onClick={() => {
              dispatch({ type: "RESET_ALL" });
            }}
          >
            Restablecer progreso
          </button>
        </div>
      )}
    </div>
  );
}

export default ItemList;
