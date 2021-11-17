import React from "react";
import { useAppState } from "../AppContext";
import useDateCheck from "../hooks/useDateCheck";
import useReminderNotification from "../hooks/useReminderNotification";
import styles from "./TodoDate.module.scss";

// Current date at the top of the page
function TodoDate() {
  const { date } = useAppState();

  console.log(date);

  useDateCheck();
  useReminderNotification();

  return (
    <div className={styles.date}>
      <div className={styles.calendar}>
        <div data-testid='day' className={styles.day}>{date.dayDisplay}</div>
        <div className={styles.my}>
          <div data-testid='month' className={styles.month}>{date.monthDisplay}</div>
          <div data-testid='year' className={styles.year}>{date.year}</div>
        </div>
      </div>
      <div data-testid='week-day' className="today">{date.weekday}</div>
    </div>
  );
}

export default TodoDate;
