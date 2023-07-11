import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import axiosInstance from "../../utils/axiosConfig";
import { format } from 'date-fns'

const CustomView = ({ dataUser, isMainLoading }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const [activeTabItem, setActiveTabItem] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!isLoading)
                    setIsLoading(true);
                // Fetch data from the API and update the state
                const response = await axiosInstance.get(`/Accounts/GetAccountByID/${dataUser.id}`);
                console.log("fetching");
                //Fetch thành công
                const { data } = response;
                setUser(data);
                setIsLoading(false); // Kết thúc quá trình fetch
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
                setIsLoading(false); // Kết thúc quá trình fetch
            }
        };
        if (!isMainLoading) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataUser, isMainLoading])

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
                                <div className="profile-avatar">
                                    {user.fullname.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <table className='dialog-field'>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <label>Tên</label>
                                                </td>
                                                <td>
                                                    <span>{user.fullname}</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <label>Số Điện Thoại</label>
                                                </td>
                                                <td>
                                                    <span>{user.phoneNo}</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <label>Trạng Thái</label>
                                                </td>
                                                <td>
                                                    {user.isLock ?
                                                        <span className="status-lock">
                                                            Bị khóa
                                                        </span>
                                                        :
                                                        <span className="status-active">
                                                            Hoạt động
                                                        </span>
                                                    }
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </div>
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
                                    Danh biểu
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="common-plain">
                        {isTabActive(1) && 
                            <OtherProfile user={user}/>
                        }
                    </div>
                </>
            )}
        </div>
    )
}

const OtherProfile = ({ user }) => {
    return (
        <div>
        <table className='dialog-field'>
            <tbody>
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
    )
}


export default CustomView;