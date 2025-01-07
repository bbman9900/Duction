package shop.duction.be.domain.user.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shop.duction.be.domain.bidding.entity.BiddedHistory;
import shop.duction.be.domain.bidding.entity.BiddingHistory;
import shop.duction.be.domain.bidding.entity.ExhibitHistory;
import shop.duction.be.domain.bidding.enums.BiddedStatus;
import shop.duction.be.domain.bidding.enums.BiddingStatus;
import shop.duction.be.domain.bidding.enums.ExhibitStatus;
import shop.duction.be.domain.item.enums.AuctionStatus;
import shop.duction.be.domain.item.repository.ItemRepository;
import shop.duction.be.domain.user.dto.EditUserInfoRequestDto;
import shop.duction.be.domain.user.dto.ExhibitorRatingRequestDto;
import shop.duction.be.domain.user.dto.MyInfoResponseDto;
import shop.duction.be.domain.user.dto.ProfileImageEditRequestDTO;
import shop.duction.be.domain.user.entity.ExhibitorRating;
import shop.duction.be.domain.user.entity.User;
import shop.duction.be.domain.user.enums.IsActive;
import shop.duction.be.domain.user.enums.Role;
import shop.duction.be.domain.user.repository.ExhibitorRatingRepository;
import shop.duction.be.domain.user.repository.UserRepository;
import shop.duction.be.exception.ItemNotFoundException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {
  private final UserRepository userRepository;
  private final ExhibitorRatingRepository exhibitorRatingRepository;
  private final ItemRepository itemRepository;

  public void saveMyInfo(Map<String, Object> userInfo, String refreshToken) {
    String kakaoId = userInfo.get("id").toString();

    Map<String, Object> account = (Map<String, Object>) userInfo.get("kakao_account");
    String email = account != null ? (String) account.get("email") : null;
    String phoneNumber = account != null ? (String) account.get("phone_number") : null;
    String address = account != null ? (String) account.get("address") : null;

    Map<String, Object> profile = (Map<String, Object>) account.get("profile");
    String nickname = profile != null ? (String) profile.get("nickname") : "새회원";
    String profileImage = profile != null ? (String) profile.get("profile_image_url") : "/src/assets/test_image.png";

    User newUser = new User();
    newUser.setEmail(email);
    newUser.setNickname(nickname);
    newUser.setProfileImage(profileImage);
    newUser.setIsActive(IsActive.ACTIVE);
    newUser.setRole(Role.USER);
    newUser.setPhone(phoneNumber);
    newUser.setAddress(address);
    newUser.setHeldBid(0);
    newUser.setUsableBid(0);
    newUser.setRate(50.0f);
    newUser.setPenaltyCount(0);
    newUser.setRefreshToken(refreshToken);
    newUser.setRegistTime(LocalDateTime.now());
    userRepository.save(newUser);
  }

  public Optional<User> checkIfUserExists(String email) {
    return userRepository.findByEmail(email);
  }

  public MyInfoResponseDto getMyInfo(Integer userId) {
    User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
    return new MyInfoResponseDto(
            user.getNickname(),
            user.getEmail(),
            user.getRate(),
            user.getHeldBid(),
            user.getUsableBid(),
            user.getProfileImage(),
            user.getPhone(),
            user.getAddress()
    );
  }

  public ResponseEntity<String> editMyInfo(EditUserInfoRequestDto editUserInfoRequestDto, Integer userId) {
    User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
    user.setNickname(editUserInfoRequestDto.getNickname());
    user.setPhone(editUserInfoRequestDto.getPhone());
    user.setAddress(editUserInfoRequestDto.getAddress());
    User save = userRepository.save(user);
    return save != null ? ResponseEntity.ok("내 정보 수정 완료") : ResponseEntity.notFound().build();
  }

  public ResponseEntity<String> deleteUser(Integer userId) {
    User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

    // 출품 이력 확인
    boolean hasActiveExhibit = user.getExhibitHistories().stream()
            .anyMatch(history -> history.getStatus().equals(ExhibitStatus.BIDDING_UNDER));
    if (hasActiveExhibit) {
      return ResponseEntity.badRequest().body("진행 중인 출품 이력이 있어 탈퇴 불가");
    }

    // 입찰 이력 확인
    boolean hasActiveBidding = user.getBiddingHistories().stream()
            .anyMatch(history -> history.getStatus().equals(BiddingStatus.BIDDING));
    if (hasActiveBidding) {
      return ResponseEntity.badRequest().body("진행 중인 입찰 이력이 있어 탈퇴 불가");
    }

    // 낙찰 이력 확인
    boolean hasActiveBidded = user.getBiddedHistories().stream()
            .anyMatch(history -> {
              if (history.getStatus().equals(BiddedStatus.BIDDED_IMMEDIATELY) ||
                      history.getStatus().equals(BiddedStatus.BIDDED)) {
                Integer itemId = history.getItem().getItemId();
                return itemRepository.findById(itemId)
                        .map(item -> item.getAuctionStatus().equals(AuctionStatus.AUCTION_COMPLETE))
                        .orElse(false);
              }
              return false;
            });
    if (hasActiveBidded) {
      return ResponseEntity.badRequest().body("진행 중인 낙찰 이력이 있어 탈퇴 불가");
    }

    user.setIsActive(IsActive.INACTIVE);
    User savedUser = userRepository.save(user);

    return savedUser != null
            ? ResponseEntity.ok("회원 탈퇴 완료")
            : ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원 탈퇴 중 문제가 발생했습니다.");
  }

  public void postRatingExhibitor(ExhibitorRatingRequestDto request, Integer userId) {

    int existingRatings = exhibitorRatingRepository.countByEvaluatorAndExhibitor(request.getExhibitorId(), userId);
    if (existingRatings > 0) {
      throw new IllegalStateException("평가 완료한 출품자입니다");
    }

    User user = userRepository.findById(userId).orElseThrow(() ->
            new ItemNotFoundException("사용자를 찾을 수 없습니다"));

    User exhibitor = userRepository.findById(request.getExhibitorId()).orElseThrow(() ->
            new ItemNotFoundException("사용자를 찾을 수 없습니다"));

    ExhibitorRating exhibitorRating = new ExhibitorRating();
    exhibitorRating.setExhibitor(exhibitor);
    exhibitorRating.setEvaluator(user);
    exhibitorRating.setRate(Float.valueOf(request.getRating()));
    exhibitorRatingRepository.save(exhibitorRating);

    Object[] ratingData = exhibitorRatingRepository.findExhibitorRatingData(request.getExhibitorId());

    Object[] data = (Object[]) ratingData[0];
    Float sum = data != null ? ((Number) data[0]).floatValue() : request.getRating(); // sum
    Long count = data != null ? ((Number) data[1]).longValue() : 1; // count

    Float rate = (sum) / (count);
    exhibitor.setRate(rate);
    userRepository.save(exhibitor);
  }

  public String updateUserProfileImage(Integer userId, ProfileImageEditRequestDTO dto) {
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new ItemNotFoundException("사용자를 찾을 수 없습니다."));
    user.setProfileImage(dto.profileImage());

    userRepository.save(user);
    return "프로필 사진 수정 완료";
  }

  public String deleteUserProfileImage(Integer userId) {
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new ItemNotFoundException("사용자를 찾을 수 없습니다."));
    user.setProfileImage(null);

    userRepository.save(user);
    return "프로필 사진 삭제 완료";
  }
}
