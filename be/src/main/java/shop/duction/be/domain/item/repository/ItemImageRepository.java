package shop.duction.be.domain.item.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import shop.duction.be.domain.item.entity.ItemImage;

public interface ItemImageRepository extends JpaRepository<ItemImage, Integer> {
  void deleteByUrl(String url);
}
