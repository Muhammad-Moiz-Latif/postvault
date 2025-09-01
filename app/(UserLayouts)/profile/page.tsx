'use client';

import { RootState } from "@/state/store"
import { useSelector } from "react-redux"
import defaultImg from '../../../assets/picture.png';
import { CldUploadWidget } from 'next-cloudinary';
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserInfoAsync } from "@/state/features/userInfoSlice";
import { useEffect } from "react";

type UploadResult = {
    event?: string;  // can be "success", "close", "queues-end", etc.
    info?: any;
};

export default function Profile() {
    const userData = useSelector((state: RootState) => state.setUserInfo.list);
    const dispatch = useDispatch();
    async function handleSuccess(result: UploadResult) {
        try {
            const response = await axios.put('/api/updateImage', { url: result.info.secure_url, username: userData.username });
            if (response.status === 200) {
                console.log('User Image updated successfully!');
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (userData.image === null) {
            //@ts-ignore
            dispatch(setUserInfoAsync({ email: userData.email }));
        }
    }, [])


    return (
        <>
            <div className="py-16 flex justify-start px-10 w-full h-screen items-start flex-col">
                {userData?.image ?
                    <img src={userData?.image}
                        className="size-28 border-[1px] border-sky-100 rounded-full"
                    />
                    : <CldUploadWidget uploadPreset="next_cloudinary" onSuccess={(result) => handleSuccess(result)}
                        onError={(error) => {
                            console.error("Upload failed:", error);
                        }}>
                        {({ open }) => {
                            return (
                                <>
                                    <img src={defaultImg.src} className="size-28 rounded-full border-[1px] border-sky-100" onClick={() => open()} />
                                    <h1>Upload an Image
                                    </h1>
                                </>

                            );
                        }}
                    </CldUploadWidget>}
                <h1>{userData.username}</h1>
                <p>{userData.email}</p>
            </div>
        </>
    )
}