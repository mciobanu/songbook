import React from 'react';
import logo from './logo.svg';
import './App.css';
import './legacy.css';

function App() {
    return (
            /*<div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <p>
                        Edit <code>src/App.tsx</code> and save to reload.
                    </p>
                    <a
                            className="App-link"
                            href="https://reactjs.org"
                            target="_blank"
                            rel="noopener noreferrer"
                    >
                        Learn React  2
                    </a>
                </header>
            </div>*/
            <div id="mainContent" > {/*onClick="onMainClick();"*/}
                {/*ttt1 close button is over the scroll bar on desktop*/}
                <span className="songTitle">Se încarcă ...</span>

                <div id="helpOuter" className="helpDivOuter helpFont">

                    {/*<input type="button" class="toolBtnNormal helpCloseBtn" value="x" onclick="toggleHelp();" />*/}

                    <div id="helpInner" className="helpDivInner">
                        <p className="helpTopSpace"> Când e activată afișarea acordurilor, deasupra primului vers se
                            generează o listă de note și acorduri, formată din până la patru părți, separate prin punct
                            și virgulă. Ele conțin:</p>
                        <ul>
                            <li>Poziția capodastrului. De exemplu <span className="helpHighlight">|2</span> indică
                                poziția a 2-a. (Se afișează doar când sunt active sugestiile.)
                            </li>
                            <li>Intervalul relativ al notelor din cântec. Un cântec de la <span
                                    className="helpHighlight">D4</span> la <span className="helpHighlight">B4</span> se
                                reprezintă la fel ca unul de la <span className="helpHighlight">D3</span> la <span
                                        className="helpHighlight">B3</span>, și anume <span
                                        className="helpHighlight">D-B</span>.
                                Se folosește <span className="helpHighlight">+</span>, <span
                                        className="helpHighlight">+2</span>, ... pentru a arăta că sunt mai multe
                                octave: la <span className="helpHighlight">D-B</span> avem 9 semitonuri (de ex.
                                între <span className="helpHighlight">D3</span> și <span
                                        className="helpHighlight">B3</span>), iar la <span
                                        className="helpHighlight">D-B+2</span> avem 33 de semitonuri (de ex. între <span
                                        className="helpHighlight">D3</span> și <span className="helpHighlight">B5</span>).
                                <span className="helpHighlight">+1</span> se prescurtează la <span
                                        className="helpHighlight">+</span></li>
                            <li>Acordurile folosite în cântec</li>
                            <li>Prima notă</li>
                        </ul>
                        <p>Probabil partea mai greu de înțeles sunt sugestiile. Scopul lor e să schimbe automat
                            acordurile pentru a se potrivi cu vocea, păstrând pe cât posibil acorduri ușor de
                            cântat.</p>
                        <p>Există niște valori implicite, dar trebuie introduse notele reale pe care cel / cei care
                            cântă cu vocea le pot lua în mod acceptabil. Notele se dau relativ, la fel cum e afișat
                            intervalul unui cântec. Cineva care cântă OK notele de la <span
                                    className="helpHighlight">C4</span> la <span
                                    className="helpHighlight">E6</span> trebuie să introducă <span
                                    className="helpHighlight">C</span> la valoarea minimă și <span
                                    className="helpHighlight">E+2</span> la cea maximă.</p>
                        <p>Pentru a ajuta la înțelegerea semnificației valorilor, la dreapta valorii maxime se afișează
                            numărul de semitonuri dintre nota cea mai joasă și cea mai înaltă.</p>
                        <p>Când sunt activate sugestiile, se poate alege o anumită poziție a capodastrului și / sau un
                            anumit acord din care să înceapă cântecul.</p>
                        <p>De asemenea, când sunt activate sugestiile, se afișează niște butoane cu combinații deja
                            calculate, primele fiind cele care par mai potrivite. Un buton pe care scrie <span
                                    className="helpHighlight">G|2 E-B+</span> va genera acorduri astfel:</p>
                        <ul>
                            <li>Capodastrul este pe poziția a 2-a</li>
                            <li>Primul acord e cântat ca <span className="helpHighlight">G</span></li>
                            <li>Notele vor fi între <span className="helpHighlight">E3-B4</span> (sau <span
                                    className="helpHighlight">E4-B5</span>, ...)
                            </li>
                        </ul>
                        <p>Când alegerea curentă necesită note care sunt în afara intervalului setat, lista cu date
                            despre note și acorduri se afișează pe fond roșu.</p>
                    </div>
                </div>

            </div>
    );
}

export default App;
