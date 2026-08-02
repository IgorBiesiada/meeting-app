function genNumber() {
    return Math.round(Math.random() * 9 + 1);
}

function App() {
    let a = genNumber();
    let b = genNumber();

    let answer = prompt(`Ile to jest ${a} + ${b}?`);

    if (parseInt(answer) === a + b) {
        return (
            <div style={{backgroundColor: "green"}}>
                Odpowiedź poprawna
            </div>
        );
    }

    return (
        <div style={{backgroundColor: "red"}}>
            Odpowiedź błędna
        </div>
    );
}

export default App;