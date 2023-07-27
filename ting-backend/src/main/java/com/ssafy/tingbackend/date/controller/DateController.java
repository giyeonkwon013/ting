package com.ssafy.tingbackend.date.controller;

import com.ssafy.tingbackend.board.dto.AdviceBoardDto;
import com.ssafy.tingbackend.common.response.CommonResponse;
import com.ssafy.tingbackend.common.response.DataResponse;
import com.ssafy.tingbackend.date.dto.QuestionDto;
import com.ssafy.tingbackend.date.dto.ScoreHistoryDto;
import com.ssafy.tingbackend.date.service.DateService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
public class DateController {

    private final DateService dateService;

    /**
     * 질문카드 조회 API
     * @return 질문카드 리스트
     */
    @GetMapping("/date/question")
    public DataResponse<List<QuestionDto>> listQuestion() {
        List<QuestionDto> questionList = dateService.getQuestions();
        return new DataResponse<>(200, "질문카드 조회 성공", questionList);
    }

    /**
     * 질문별 점수 저장 API
     * @param principal 로그인한 유저의 id (자동주입)
     * @param scoreHistoryDto matchingId, questionId, score, questionOrder
     * @return Only code and message
     */
    @PostMapping("/date/score")
    public CommonResponse insertScoreHistory(@RequestBody ScoreHistoryDto scoreHistoryDto, Principal principal) {
        Long userId = Long.parseLong(principal.getName());
        scoreHistoryDto.setUserId(userId);
        dateService.insertScoreHistory(scoreHistoryDto);
        return new CommonResponse(200, "상담글 작성 성공");
    }

}
