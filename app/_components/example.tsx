'use client';

import styles from '@/app/_components/example.module.css';
import { useState } from 'react';
import { dummyApi } from '@/app/api/dummy/api';

const Example = () => {
  const [err, setErr] = useState('');
  const onClickHandler = async () => {
    const res = await dummyApi();
    if (!res)
      setErr(`Too Many Requests,
    try after 30 seconds.`);
    else setErr('Passed!');
  };

  return (
    <div>
      <button className={styles.example} type="button" onClick={onClickHandler}>
        <h2>Send Req</h2>
        {err ? <p>{err}</p> : null}
      </button>
    </div>
  );
};

export default Example;
