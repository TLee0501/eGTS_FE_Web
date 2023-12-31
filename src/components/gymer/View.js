import React, { useMemo, useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosConfig";
import { format } from 'date-fns'
import Calendar from "../../flagments/advance-calendar";
import { ScheduleDetail } from "./dialog";
import { AdvanceTable, LoadingTable } from "../../flagments/advance-table";
import COLUMNS from "../package_gymer/Columns";
import PackageGymerDialog from "../package_gymer/dialog";
import { formatPhoneNumber } from "../../utils/convert";

const CustomView = ({ userId, setDataView, isMainLoading }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const [activeTabItem, setActiveTabItem] = useState(1);
    useEffect(() => {
        const fetchData = async () => {
            if (!isLoading) {
                setIsLoading(true);
            }
            try {
                // Fetch data from the API and update the state
                const response = await axiosInstance.get(`/Accounts/GetAccountByID/${userId}`);
                //Fetch thành công
                const { data } = response;
                setUser(data);
            } catch (error) {
                if (error.response) {
                    // Lỗi được trả về từ phía server
                    setErrorMessage(error.response.data.message);
                } else {
                    // Lỗi không có phản hồi từ server
                    setErrorMessage(
                        <>
                            <p>Đã xảy ra lỗi. Vui lòng thử lại sau.</p>
                            <span>Mã lỗi: {error.code}</span>
                        </>
                    );
                }

            }
            setIsLoading(false); // Kết thúc quá trình fetch
        };
        if (!isMainLoading) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId, isMainLoading])

    const handleTabClick = (tabItem) => {
        activeTabItem !== tabItem && setActiveTabItem(tabItem);
    };

    const isTabActive = (tabItem) => {
        return activeTabItem === tabItem ? true : false;
    };

    return (
        <div className="data-view">
            <hr className="view-divider" />
            <div className="sep-container">
                <div className="sep-text">Thông tin</div>
                <button type="button" className="button-close" onClick={() => setDataView()}>&times;</button>
            </div>
            {isLoading ? (
                <div className="loading-overlay">
                    <i className="fa-solid fa-spinner fa-spin-pulse"></i>
                    <span>Đang tải dữ liệu...</span>
                </div>
            ) : (
                <>
                    <div className="profile-container">
                        {errorMessage ? (
                            <span className="status-error">{errorMessage}</span>
                        ) : (
                            <>
                                <div className="user-avatar">
                                    <div className="profile-avatar">
                                        {user.fullname.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <table className='dialog-field'>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <span>{user.fullname}</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        ({user.isDelete ?
                                                            <span className="status-lock">
                                                                Bị khóa
                                                            </span>
                                                            :
                                                            <span className="status-active">
                                                                Hoạt động
                                                            </span>
                                                        })
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="user-details">
                                    <div className="common-tabs">
                                        <div className={`common-tab ${isTabActive(1) ? 'common-tab-selected' : ''}`} onClick={() => handleTabClick(1)}>
                                            <div className="common-tab-container">
                                                <span className="common-tab-name">
                                                    Tổng quan
                                                </span>
                                            </div>
                                        </div>
                                        <div className={`common-tab ${isTabActive(2) ? 'common-tab-selected' : ''}`} onClick={() => handleTabClick(2)}>
                                            <div className="common-tab-container">
                                                <span className="common-tab-name">
                                                    Gói tập
                                                </span>
                                            </div>
                                        </div>
                                        <div className={`common-tab ${isTabActive(3) ? 'common-tab-selected' : ''}`} onClick={() => handleTabClick(3)}>
                                            <div className="common-tab-container">
                                                <span className="common-tab-name">
                                                    Danh biểu
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="common-plain">
                                        {isTabActive(1) &&
                                            <OtherProfile user={user} />
                                        }
                                        {isTabActive(2) &&
                                            <PackageHistory userId={user.id} />
                                        }
                                        {isTabActive(3) &&
                                            <Schedule userId={user.id} />
                                        }
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

const OtherProfile = ({ user }) => {
    return (
        <div className="profile-overview">
            <div className="user-info">
                <table className='dialog-field'>
                    <tbody>
                        <tr>
                            <td width={200}>
                                <label>Họ Tên</label>
                            </td>
                            <td>
                                <span>{user.fullname}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>Số điện thoại</label>
                            </td>
                            <td>
                                <span>{formatPhoneNumber(user.phoneNo)}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>Giới Tính</label>
                            </td>
                            <td>
                                <span>{user.gender === 'M' ? 'Nam' : user.gender === 'F' ? 'Nữ' : user.gender}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>Ngày tham gia</label>
                            </td>
                            <td>
                                <span>{format(new Date(user.createDate), 'dd/MM/yyyy')}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

const PackageHistory = ({ userId }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [packageData, setPackageData] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const columns = useMemo(() => COLUMNS, []);
    const initialState = useMemo(() => ({
        hiddenColumns: ['packageName'],
        sortBy: [
            {
                id: "from",
                desc: true
            }
        ]
    }), []);

    useEffect(() => {
        const fetchData = async () => {
            if (!isLoading) setIsLoading(true);
            try {
                const response = await axiosInstance.get('/PackageGymers/GetPackageGymerByGymerID', {
                    params: {
                        request: userId
                    }
                });
                const { data } = response.data;
                if (data)
                    setPackageData(data);
            } catch (error) {
                if (error.response) {
                    // Lỗi được trả về từ phía server
                    setErrorMessage(error.response.data.message);
                } else {
                    // Lỗi không có phản hồi từ server
                    setErrorMessage(
                        <>
                            <p>Đã xảy ra lỗi. Vui lòng thử lại sau.</p>
                            <span>Mã lỗi: {error.code}</span>
                        </>
                    );
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    const dialogs = useMemo(() => ({
        dialogView: {
            title: "Thông tin",
            icon: <i className="fa-solid fa-eye"></i>,
            component: PackageGymerDialog.View
        }
    }), []);

    return (
        <>
            {isLoading ? (
                <LoadingTable />
            ) : errorMessage ? (
                <span className="status-error">{errorMessage}</span>
            ) : (
                <div className="list-content">
                    <AdvanceTable data={packageData} columns={columns} initialState={initialState} dialogs={dialogs} />
                </div>
            )}
        </>
    )
}


const Schedule = ({ userId }) => {
    const [scheduleData, setScheduleData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchScheduleData = async () => {
            const mergedData = [];

            if (!isLoading) setIsLoading(true);
            try {
                const response = await axiosInstance.get(`/NutritionSchedules/GetNutritionScheduleByGymerID/${userId}`);
                const { data } = response.data;
                mergedData.push(...data);
            } catch (error) {
                console.error('Xảy ra lỗi khi lấy danh sách dinh dưỡng: ', error);
            }
            try {
                const response = await axiosInstance.get(`/ExcerciseSchedules/GetExcerciseScheduleByGymerIDV2/${userId}`);
                const { data } = response.data;
                mergedData.push(...data);
            } catch (error) {
                console.error('Xảy ra lỗi khi lấy danh sách bài tập: ', error);
            }
            setScheduleData(mergedData);
            setIsLoading(false);
        };

        fetchScheduleData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    const Tooltip = ({ data }) => {
        const nutritionData = data.filter((item) => item.nutritionScheduleId && item.foodAndSuppliment !== null);
        const exerciseData = data.filter((item) => item.scheduleId);

        return (
            <>
                {exerciseData.length > 0 && (
                    <div className="bar exercise-bar">
                        <span>Danh sách bài tập</span>
                        {exerciseData.length > 1 &&
                            <span>x{exerciseData.length}</span>
                        }
                    </div>
                )}
                {nutritionData.length > 0 && (
                    <div className="bar nutrition-bar">
                        <span>Thực đơn dinh dưỡng</span>
                        {nutritionData.length > 1 &&
                            <span>x{nutritionData.length}</span>
                        }
                    </div>
                )}
            </>
        )
    }

    const tooltipOpt = useMemo(() => ({
        component: Tooltip
    }), []);

    const dialog = useMemo(() => ({
        scheduleDetail: {
            title: "Danh biểu",
            component: ScheduleDetail
        }
    }), [])

    return (
        <div>
            <div className="schedule-title">
                <h1>Danh biểu</h1>
            </div>
            {isLoading ? (
                <div className="loading-overlay">
                    <i className="fa-solid fa-spinner fa-spin-pulse"></i>
                    <span>Đang tải dữ liệu...</span>
                </div>
            ) : scheduleData.length > 0 ? (
                <Calendar data={scheduleData} tooltipOpt={tooltipOpt} dialog={dialog} />
            ) : (
                <span className="status-error">
                    Thành viên hiện không có danh biểu
                </span>
            )}
        </div>
    );
}

export default CustomView;