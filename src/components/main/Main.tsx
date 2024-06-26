import { MainHeader } from "./mainHeader/MainHeader";
import { MainTable } from "./mainTable/MainTable";
import { Pagination } from "./pagination/Pagination";

export const Main = () => (
    <div className="main">
        <MainHeader />
        <MainTable />
        <Pagination />
    </div>
)