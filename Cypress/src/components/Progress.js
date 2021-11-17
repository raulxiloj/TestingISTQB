import React from "react";
import { useItems, useAppState } from "../AppContext";

import styles from "./Progress.module.scss";

// Progress bar for completed/paused todo items
function Progress() {
  const totalAmount = useAppState().items.length;
  const { paused, completed } = useItems();
  const completedAmount = completed.length;
  const pausedAmount = paused.length;

  let completedPercentage = completedAmount / totalAmount;
  let pausedPercentage = pausedAmount / totalAmount + completedPercentage;

  if (isNaN(completedPercentage)) {
    completedPercentage = 0;
  }

  if (isNaN(pausedPercentage)) {
    pausedPercentage = 0;
  }

  return (
    <div data-testid='progress-container' className={styles.progress}>
      <div
        data-testid='pause-progress'
        className={`${styles.progressbar} ${styles.paused}`}
        style={{ width: `${pausedPercentage * 100}%` }}
      ></div>
      <div
        data-testid='complete-progress'
        className={`${styles.progressbar} ${styles.completed}`}
        style={{ width: `${completedPercentage * 100}%` }}
      ></div>
    </div>
  );
}

export default Progress;
