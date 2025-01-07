package shop.duction.be.domain.user.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import shop.duction.be.domain.user.entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
  Optional<User> findByEmail(String email);
  User findHeldBidAndUsableBidByUserId(Integer id);
}
