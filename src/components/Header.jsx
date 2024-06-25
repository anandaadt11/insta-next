"use client";

import Image from "next/image";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import Modal from "react-modal";
import { useEffect, useRef, useState } from "react";
import { FiPlusCircle } from "react-icons/fi";
import { HiCamera } from "react-icons/hi2";
import { IoClose } from "react-icons/io5";
import { app } from "@/firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

export default function Header() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFIleUploading, setImageFileUploading] = useState(false);
  const filePickerRef = useRef(null);

  const closeModal = () => {
    setIsOpen(false);
    setSelectedFile(null);
  };

  useEffect(() => {
    if (selectedFile) {
      uploadImageToStorage();
    }
  }, [selectedFile]);

  async function uploadImageToStorage() {
    setImageFileUploading(true);
    const storage = getStorage(app);
    const filename = new Date().getTime() + "-" + selectedFile.name;
    console.log(filename);
    const storageRef = ref(storage, filename);
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload " + progress + "% done");
      },
      (error) => {
        console.error(error);
        setImageFileUploading(false);
        setImageFileUrl(null);
        selectedFile(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setImageFileUrl(downloadUrl);
          setImageFileUploading(false);
        });
      }
    );
  }

  const addImageToPost = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="shadow-sm border-b sticky top-0 bg-white z-30 p-3">
      <div className="flex justify-between max-w-6xl mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="hidden lg:inline-flex"
        >
          <Image
            src="/instagram-font.webp"
            alt="Logo"
            width={96}
            height={96}
          />
        </Link>
        <Link
          href="/"
          className="lg:hidden "
        >
          <Image
            src="/instagram-logo.webp"
            alt="Logo"
            width={40}
            height={40}
          />
        </Link>

        {/* Searchbar */}
        <input
          type="text"
          placeholder="Search"
          className="bg-gray-50 border border-gray-200 rounded text-sm w-full py-2 px-4 max-w-[210px]"
        />

        {/* Profile */}
        {session ? (
          <div className="flex items-center gap-5">
            <FiPlusCircle
              size={20}
              className="cursor-pointer hover:scale-110 transform transition duration-200"
              onClick={() => setIsOpen(true)}
            />
            <img
              src={session.user.image}
              alt={session.user.name}
              className="rounded-full w-10 h-10 cursor-pointer border-2 border-gray-800"
              onClick={signOut}
            />
          </div>
        ) : (
          <button
            onClick={signIn}
            className="text-sm font-semibold text-blue-500"
          >
            Login
          </button>
        )}
      </div>
      {isOpen && (
        <>
          <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            ariaHideApp={false}
            className="max-w-lg w-[90%] p-6 absolute top-56 left-[50%] translate-x-[-50%] bg-white border-2 rounded-md shadow-md"
          >
            <div className="flex flex-col justify-center items-center h-[100%]">
              {selectedFile ? (
                <img
                  src={imageFileUrl}
                  alt=""
                  className={`object-cover max-h-[250px] w-full my-4 cursor-pointer ${
                    imageFIleUploading ? "animate-pulse" : ""
                  }`}
                  onClick={() => filePickerRef.current.click()}
                />
              ) : (
                <HiCamera
                  size={100}
                  className=" text-gray-400 cursor-pointer my-4"
                  onClick={() => filePickerRef.current.click()}
                />
              )}
              <input
                hidden
                ref={filePickerRef}
                type="file"
                accept="image/*"
                onChange={addImageToPost}
              />
            </div>
            <textarea
              type="text"
              maxLength={150}
              placeholder="Please enter your caption..."
              className="h-20 border-none w-full  outline-none ring-2 rounded-md p-2 ring-gray-100 mb-4"
            />
            <button className=" bg-blue-600 p-2 text-white text-sm hover:brightness-125 font-semibold rounded-md disabled:bg-blue-400 cursor-progress disabled:brightness-100">
              Upload
            </button>
            <IoClose
              size={25}
              className="absolute right-3 top-3 cursor-pointer text-gray-600"
              onClick={closeModal}
            />
          </Modal>
        </>
      )}
    </div>
  );
}
