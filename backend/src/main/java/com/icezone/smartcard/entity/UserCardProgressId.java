package com.icezone.smartcard.entity;

import java.io.Serializable;
import java.util.Objects;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
public class UserCardProgressId implements Serializable {
    private Long user;
    private Long card;

    @Override
    public boolean equals(Object o) {
        if(this == o) return true;
        if(o == null || getClass() != o.getClass()) return false;
        UserCardProgressId that = (UserCardProgressId) o;
        return Objects.equals(user, that.user) && Objects.equals(card, that.card);
    }

    @Override
    public int hashCode() {
        return Objects.hash(user, card);
    }
}
