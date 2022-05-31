import React, { ChangeEvent, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";
import toast, { Toaster } from "react-hot-toast";
import Popup from "reactjs-popup";
import styled from "styled-components";
import AddBtn from "../components/AddBtn";
import { Password } from "../types";
import { v4 as uuidv4 } from "uuid";
import { motion } from "framer-motion";
import CryptoJS from 'crypto-js'
import { reverse } from "../utils/reverse";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  background-color: ${(props) => props.theme.body};
  color: ${(props) => props.theme.text};
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 3rem;
  line-height: 3rem;
  background-color: ${(props) => props.theme.text};
  color: ${(props) => props.theme.body};
`;

const Logo = styled.div`
  margin-left: 2rem;
  user-select: none;
  cursor: pointer;
`;

const AddRight = styled.span`
  margin-right: 2rem;
  height: 25px;
  line-height: 25px;
  cursor: pointer;
  &:hover path {
    fill: #55efc4;
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem 2rem;
`;

const PwdItem = styled.div`
  display: flex;
  margin-top: 1rem;
  padding-bottom: 0.5rem;
  height: 3rem;
  line-height: 3rem;
  justify-content: space-evenly;
  border-bottom: 1px solid ${(props) => props.theme.text};
`;

const PwdTitle = styled.div`
  width: 20rem;
  max-width: 20rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-right: 1rem;
`;

const PwdSubTitle = styled.div`
  width: 30rem;
  max-width: 30rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-right: 1rem;
`;

const PwdFrom = styled.a`
  width: 20rem;
  max-width: 20rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-right: 1rem;
  text-decoration: none;
  color: ${(props) => props.theme.text};
`;

const PwdType = styled.div`
  width: 15rem;
  max-width: 15rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-right: 1rem;
`;

const Actions = styled.div`
  display: flex;
`;

const Action = styled.button`
  width: 5rem;
  opacity: 1;
  border: none;
  outline: none;
  background-color: ${(props) => props.theme.text};
  color: ${(props) => props.theme.body};
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.hover};
  }
`;

const PopupContent = styled(motion.div)`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.text};
  width: 30rem;
  padding: 0 2rem;
  border-radius: 2rem;
`;

const PopupHeader = styled.div`
  text-align: center;
  height: 3rem;
  line-height: 3rem;
`;

const PopupForm = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
`;

const FormLabel = styled.label`
  width: 4rem;
`;

const FormInput = styled.input`
  width: calc(100% - 4rem);
  border: 1px solid transparent;
  outline: none;
  padding: 0.4rem 0.4rem;
  background-color: ${(props) => props.theme.body};
  color: ${(props) => props.theme.text};
`;

const FormButton = styled.button<{ bgColor: string }>`
  width: 8rem;
  height: 3rem;
  opacity: 1;
  border: none;
  outline: none;
  background-color: ${(props) => props.bgColor};
  color: ${(props) => props.theme.text};
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

const localList = localStorage.getItem("list");

const pwdSecure = localStorage.getItem("pwdSecure")

const MainPage = () => {
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);

  const [editStatus, setEditStatus] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);

  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [password, setPassword] = useState("");
  const [from, setFrom] = useState("");
  const [type, setType] = useState("压缩包");

  const [pwdList, setPwdList] = useState<Password[]>(
    localList && localList !== "undefined" && localList !== "null"
      ? JSON.parse(localList)
      : []
  );
  const [secure] = useState<string>(
    pwdSecure && pwdSecure !== "undefined" && pwdSecure !== "null"
    ? pwdSecure
    : ''
  )

  const handleClicBoard = (id: string) => {
    const result = pwdList.find((item) => item.id === id);
    if (!result) {
    } else {
      const pwd = result.secure
      const bytes  = CryptoJS.AES.decrypt(pwd, reverse(secure));
      const originalText = bytes.toString(CryptoJS.enc.Utf8);
      navigator.clipboard.writeText(originalText).then((res) => {
        toast.success("复制成功");
      });
    }
  };

  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleChangeSubTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setSubTitle(e.target.value);
  };

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleChangeForm = (e: ChangeEvent<HTMLInputElement>) => {
    setFrom(e.target.value);
  };

  const handleChangeType = (e: ChangeEvent<HTMLInputElement>) => {
    setType(e.target.value);
  };

  const handleJSON2Local = (list: Password[]) => {
    localStorage.setItem("list", JSON.stringify(list));
  };

  const handleSave = () => {
    if (title === "") {
      toast.error("请输入标题");
    } else if (subTitle === "") {
      toast.error("请输入副标题");
    } else if (password === "") {
      toast.error("请输入密码");
    } else {
      const list: Password[] = [
        ...pwdList,
        {
          id: uuidv4(),
          title,
          subTitle,
          secure: CryptoJS.AES.encrypt(password, reverse(secure)).toString(),
          from,
          type,
          createAt: Date.now(),
        },
      ];
      setPwdList(list);
      toast.success("保存成功");
      handleCancel();
      handleJSON2Local(list);
    }
  };

  const handleCancel = () => {
    unstable_batchedUpdates(() => {
      setTitle("");
      setSubTitle("");
      setPassword("");
      setFrom("");
      setType("压缩包");
      setOpen(false);
      setEditIndex(-1);
      setEditStatus(false);
    });
  };

  const handleUpdate = () => {
    if (title === "") {
      toast.error("请输入标题");
    } else if (subTitle === "") {
      toast.error("请输入副标题");
    } else {
      const list: Password[] = JSON.parse(JSON.stringify(pwdList));
      let tempItem = list[editIndex];
      list[editIndex] = {
        id: tempItem.id,
        title,
        subTitle,
        secure: password ? CryptoJS.AES.encrypt(password, reverse(secure)).toString() : tempItem.secure,
        from,
        type,
        createAt: tempItem.createAt,
      };
      setPwdList(list);
      toast.success("更新成功");
      handleCancel();
      handleJSON2Local(list);
    }
  };

  const handleEdit = (item: Password) => {
    const index = pwdList.findIndex((i) => item.id === i.id);
    unstable_batchedUpdates(() => {
      setEditStatus(true);
      setEditIndex(index);
      setTitle(item.title);
      setSubTitle(item.subTitle);
      setPassword("");
      setFrom(item.from);
      setType(item.type);
      setOpen(true);
    });
  };

  const handleDelete = (id: string) => {
    const index = pwdList.findIndex((item) => item.id === id);
    const temp = JSON.parse(JSON.stringify(pwdList)) as Password[];
    temp.splice(index, 1);
    setPwdList(temp);
    handleJSON2Local(temp);
  };

  return (
    <Container>
      <Toaster />
      <Header>
        <Logo>Password Use</Logo>
        <AddRight onClick={() => setOpen((o) => !o)}>
          <AddBtn width={25} height={25} />
        </AddRight>
      </Header>
      <List>
        {pwdList.map((item) => (
          <PwdItem key={item.id}>
            <PwdTitle>{item.title}</PwdTitle>
            <PwdSubTitle>{item.subTitle}</PwdSubTitle>
            <PwdFrom target={"_blank"} href={item.from}>
              {item.from}
            </PwdFrom>
            <PwdType>{item.type}</PwdType>
            <Actions>
              <Action onClick={() => handleClicBoard(item.id)}>Use</Action>
              <Action style={{ margin: '0 0.5rem'}} onClick={() => handleEdit(item)}>编辑</Action>
              <Action onClick={() => handleDelete(item.id)}>删除</Action>
            </Actions>
          </PwdItem>
        ))}
      </List>
      <Popup modal open={open} onClose={closeModal}>
        <PopupContent
          initial={{ width: 0 }}
          animate={{ width: "30vw" }}
          transition={{ type: "spring", duration: 0.3 }}
        >
          <PopupHeader>添加密码</PopupHeader>
          <PopupForm>
            <FormItem>
              <FormLabel>标题:</FormLabel>
              <FormInput value={title} onChange={handleChangeTitle} />
            </FormItem>
            <FormItem>
              <FormLabel>副标题:</FormLabel>
              <FormInput value={subTitle} onChange={handleChangeSubTitle} />
            </FormItem>
            <FormItem>
              <FormLabel>密码:</FormLabel>
              <FormInput type={"password"} value={password} onChange={handleChangePassword} />
            </FormItem>
            <FormItem>
              <FormLabel>来源:</FormLabel>
              <FormInput value={from} onChange={handleChangeForm} />
            </FormItem>
            <FormItem>
              <FormLabel>类型:</FormLabel>
              <FormInput value={type} onChange={handleChangeType} />
            </FormItem>
            <FormItem style={{ justifyContent: "space-evenly" }}>
              {editStatus ? (
                <FormButton onClick={handleUpdate} bgColor="#0984e3">
                  编辑
                </FormButton>
              ) : (
                <FormButton onClick={handleSave} bgColor="#0984e3">
                  保存
                </FormButton>
              )}
              <FormButton onClick={handleCancel} bgColor="#d63031">
                取消
              </FormButton>
            </FormItem>
          </PopupForm>
        </PopupContent>
      </Popup>
    </Container>
  );
};

export default MainPage;
