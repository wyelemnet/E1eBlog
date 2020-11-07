import React, { useState, useEffect } from 'react';

function App() {
    const [count, setCount] = useState(0);

    const handleClick = () => {
        setCount(count + 1);
    };

    useEffect(() => {
        document.title = `you clicked ${count} times`;
    });

    return (
        <div>
            <p>you clicked {count} times</p>
            <button onClick={handleClick}>click</button>
        </div>
    );
}

export default App;