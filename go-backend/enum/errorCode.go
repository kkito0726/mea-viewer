package enum

type ErrorCode int

// iotaを用いて連番を生成する
const (
	C001 ErrorCode = iota
	C002
	C003
	C004
	C005
	C006
	C007
	C008
	C009
	C010

	F001
	F002
)

// iotaを用いて生成した連番に対して、別名を与えて定義する
func (ec ErrorCode) Code() string {
	switch ec {
	case C001:
		return "C-001"
	case C002:
		return "C-002"
	case C003:
		return "C-003"
	case C004:
		return "C-004"
	case C005:
		return "C-005"
	case C006:
		return "C-006"
	case C007:
		return "C-007"
	case C008:
		return "C-008"
	case C009:
		return "C-009"
	case C010:
		return "C-010"

	case F001:
		return "F-001"
	case F002:
		return "F-002"
	default:
		return "未定義"
	}
}

// iotaを用いて生成した連番に対して、別名を与えて定義する
func (ec ErrorCode) Message() string {
	switch ec {
	case C001:
		return "このユーザーネームはすでに使用されています"
	case C002:
		return "このメールアドレスはすでに登録されています"
	case C003:
		return "ユーザー登録に失敗しました"
	case C004:
		return "トークン生成に失敗しました"
	case C005:
		return "トークン登録に失敗しました"
	case C006:
		return "ユーザーが見つかりませんでした"
	case C007:
		return "認証情報が切れています。再度ログインしてください"
	case C008:
		return "トークン削除に失敗しました"
	case C009:
		return "ユーザー更新に失敗しました"
	case C010:
		return "ユーザー削除に失敗しました"

	case F001:
		return "画像ストレージの削除に失敗しました"
	case F002:
		return "DBから該当レコードの削除に失敗しました"
	default:
		return "未定義"
	}
}
