import { useNavigate } from "react-router-dom"
import { useCallback, useState, forwardRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import basicHttp from '../../api/basicHttp';
import { setGender, setName, setRegion, setBirth, setNickname } from '../../redux/signup';
import { regionList } from "../../SelectionDataList";

import styles from './SignupCommon.module.css';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

function Detail() {
  const Navigate = useNavigate();
  // let [inputName, setInputName] = useState("");
  let [inputNickname, setInputNickname] = useState("");
  let [checkNickname, setCheckNickname] = useState(false);
  let [currentRegion, setCurrentRegion] = useState("");
  let allContentsNum = 5;
  let [checkAllContents, setCheckAllContents] = useState([false, false, false, false, false]); // 리스트 하드코딩 수정하기
  
  // 생년월일
  const [birthDate, setBirthDate] = useState("");

  let dispatch = useDispatch();
  let signupReducer = useSelector((state) => state.signupReducer);

  // 항목 입력 체크
  let [region, setRegion] = useState("");

  // 한글만 허용하는 패턴
  const koreanPattern = /^[가-힣]*$/;
  // const stringPattern = /^[가-힣]*$/;

  // 이름 작성 확인 - 영문도 포함 가능하도록 수정 필요
  const nameIsExist = (data) => {
    let copy_checkAllContents = [...checkAllContents];
    
    // 올바른 형태일 때 true로 변경
    if (koreanPattern.test(data)) {
      copy_checkAllContents[0] = true;
      setCheckAllContents(copy_checkAllContents);
      dispatch(setName(data));
    }
    else {
      copy_checkAllContents[0] = false;
      setCheckAllContents(copy_checkAllContents);
    }
  }
  
  // 닉네임 중복 체크
  const nicknameIsExist = () => {
    // 닉네임 한글 확인
    // 한글이 아닌 글자가 있다면 경고메세지 출력
    if (!koreanPattern.test(inputNickname)) {
      alert("한글만 입력해주세요.");
    }
    else {
      basicHttp.get(`/user/nickname/${inputNickname}`).then((response) => {
        if (response.data.code === 200) {
          // 닉네임 중복 시
          if (response.data.data === true) {
            alert("닉네임이 중복되었습니다.\n다시 작성해주세요.")
          }
          else {
            alert("닉네임 사용이 가능합니다.");
            setCheckNickname(true);
            // redux 저장
            // dispatch(setNickname(inputNickname));

            // let copy_checkAllContents = [...checkAllContents];
            // copy_checkAllContents[1] = true;
            // setCheckAllContents(copy_checkAllContents);
          }
        }
        else if (response.data.code === 400) {
          console.log('400 error');
        }
      })
      .catch(() => console.log("실패"));
    }
  }

  // 성별 체크 확인 업데이트
  const genderIsExist = () => {
    let copy_checkAllContents = [...checkAllContents];
    copy_checkAllContents[2] = true;
    setCheckAllContents(copy_checkAllContents);
  }

  // 생일 입력 확인
  const birthIsExist = (input) => {
    let copy_checkAllContents = [...checkAllContents];
    if (input.length === 10) {
      // redux에 저장
      dispatch(setBirth(input))
  
      // 항목 확인
      copy_checkAllContents[3] = true;
    }
    else {
      copy_checkAllContents[3] = false;
    }
    setCheckAllContents(copy_checkAllContents);
  }

  // 지역 선택 확인
  const regionIsExist = (region) => {
    // redux에 저장
    dispatch(setRegion(region))
  
    // 항목 확인
    let copy_checkAllContents = [...checkAllContents];
    copy_checkAllContents[4] = true;
    setCheckAllContents(copy_checkAllContents);
  }

  // 추가 정보 입력하기 클릭 시
  const goToSelect = (moveTo) => {
    // 가입 완료하고, 선택정보 입력 페이지로 이동
    completeSignup(moveTo);
  }

  // 엔터키로 버튼 누를 수 있게
  const activeEnter = (e, check) => {
    if(e.key === "Enter") {
      switch (check) {
        case nicknameIsExist:
          nicknameIsExist();
          break;
      }
    }
  }

  // 회원가입 완료 클릭 시
  const completeSignup = (moveTo) => {
    console.log(checkAllContents)
    console.log(signupReducer)
    // 모두 true라면 회원가입 요청
    if (checkAllContents.every(item => item === true)) {
      let selectionData = {
        profileImage: "",
        mbtiCode: "",
        heightCode: "",
        drinkingCode: "",
        smokingCode: "",
        religionCode: "",
        hobbyCodeList: [],
        jobCode: "",
        personalityCodeList: [],
        introduction: "",
        styleCodeList: [],
      }
      
      let data = {
        email: signupReducer.email,
        password: signupReducer.password,
        name: signupReducer.name,
        nickname: signupReducer.nickname,
        phoneNumber: signupReducer.phonenumber,
        gender: signupReducer.gender,
        birth: signupReducer.birth,
        region: signupReducer.region,
        ...selectionData
      }
      basicHttp.post('/user/signup', data).then((response) => {
        console.log(response)
        console.log(data)
        if (response.data.code === 200) {
          alert("회원가입이 완료되었습니다.");
          Navigate(moveTo);
        }
        else if (response.data.code === 400) {
          alert("회원 가입 실패");
        }
      })
    }
    else {
      alert("모든 항목을 입력 또는 체크해주세요.");
      console.log(checkAllContents);
      console.log(signupReducer);
    }
  }

  useEffect(() => {
    console.log(birthDate)
  },[birthDate])

  return(
    <div className={styles.wrapper}>
      {/* <label>이름을 입력해주세요</label> */}
      <div className={styles.nameContainer}>
        <input 
          className={styles.input} 
          id={styles.nameInput} 
          type="text" 
          onChange={(e) => { nameIsExist(e.target.value) }} 
          placeholder="이름"></input>
        <div>
          <input 
            className={styles.input} 
            type="text" 
            onChange={(e) => setInputNickname(e.target.value)}
            onKeyDown={(e) => activeEnter(e, nicknameIsExist)}
            placeholder="닉네임"></input>
          <button 
            className={styles.btn} 
            onClick={nicknameIsExist}>
          중복확인</button>
          <p>닉네임은 한글로만 작성해야하며, 닉네임은 중복될 수 없습니다.</p>
          <p>
            {
              checkNickname &&
              "닉네임 중복 확인 완료"
            }
          </p>
        </div>
      </div>
      <button
        className={[styles.selectBtn, styles.genderBtn].join(" ")} 
        onClick={() => {
          dispatch(setGender("M"));
          genderIsExist();
      }}>남</button>
      <button
        className={[styles.selectBtn, styles.genderBtn].join(" ")} 
        onClick={() => {
          dispatch(setGender("F"));
          genderIsExist();
      }}>여</button>
      <br/>

      <label>생년월일</label>
      <input type="date" onChange={(e) => setBirthDate(e.target.value)}></input>
      <br/>

      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          지역 선택
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {
            regionList.map((region, i) => (
              <Dropdown.Item onClick={() => setRegion(region.regionKor)}>{region.regionKor}</Dropdown.Item>
              )
            )
          }
        </Dropdown.Menu>
      </Dropdown>
      <p>{ region }</p>
      <br/>
      <button className={styles.btn} onClick={(e) => goToSelect("/signup/select/mbti")}>추가 정보 입력하기</button>
      <button className={styles.btn} onClick={(e) => completeSignup("/login")}>로그인 하러 가기</button>
    </div>
  )
}

export default Detail