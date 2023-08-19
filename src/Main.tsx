import {Routes, Route} from 'react-router-dom';
import {HelpPage} from "./pages/HelpPage";
import {LoaderPage} from "./pages/LoaderPage";
import {SongPage} from "./pages/SongPage";

const Main = () => {
    return (<Routes>
                <Route path='/' element={<LoaderPage/>}/>
                <Route path='/help' element={<HelpPage/>}/>
                <Route path='/song' element={<SongPage/>}/>
            </Routes>
    );
}
export default Main;
