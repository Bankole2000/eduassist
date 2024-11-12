export type User = {
  id: string;
	collectionId: string;
	collectionName: string;
	username: string;
	verified: boolean;
	emailVisibility: boolean;
	email: string;
	created: string;
	updated: string;
	firstname: string;
	lastname: string;
	gender: string;
	avatar: string;
}

export type UserUpdateData = {
  username: string,
  password?: string,
  passwordConfirm?: string,
  oldPassword?: string,
  firstname: string,
  lastname: string,
  gender: string,
}

export type Semester = {
  id: string;
	collectionId: string;
	collectionName: string;
	created: string;
	updated: string;
	name: string;
	order: number;
	level: string;
	level_select: string;
  expand?: {
    level?: Level,
    courses_via_semester?: Course[]
  }
}

export type Quiz = {
  id: string;
	collectionId: string;
	collectionName: string;
	created: string;
	updated: string;
	subject: string;
	courses: string[];
  expand?: {
    courses?: Course[];
    questions_via_quizzes?: Question[];
    attempts_via_quiz?: Attempt[];
  }
}

export type Question = {
	id: string;
	collectionId: string;
	collectionName: string;
	created: string;
	updated: string;
	question: string;
	correct_option: string;
	options: string[];
	quizzes: string[];
  expand?: {
    quizzes?: Quiz[];
    options?: Option[];
    correct_option?: Option;
  }
}

export type Option = {
  id: string;
	collectionId: string;
	collectionName: string;
	created: string;
	updated: string;
	option: string;
	image: string;
  expand?: {

  }
}

export type Level = {
	id: string;
	collectionId: string;
	collectionName: string;
	created: string;
	updated: string;
	name: string;
	order: number;
  expand?: {
    semesters_via_level?: Semester[]
  }
}

export type Course = {
  id: string;
	collectionId: string;
	collectionName: string;
	created: string;
	updated: string;
	title: string;
	course_code: string;
	semester: string;
  expand?: {
    semester?: Semester,
    quizzes_via_courses?: Quiz[]
  }
}

export type Attempt = {
  id: string;
	collectionId: string;
	collectionName: string;
	created: string;
	updated: string;
	user: string;
	quiz: string;
  expand?: {
    user?: User,
    quiz?: Quiz,
  }
}

export type Answer = {
  id: string;
	collectionId: string;
	collectionName: string;
	created: string;
	updated: string;
	attempt: string;
	question: string;
	answer: string;
	user: string;
  expand?: {
    attempt?: Attempt,
    question?: Question,
    answer?: Option,
    user?: User,
  }
}

export type UserAttempt = {
  id: string;
	collectionId: string;
	collectionName: string;
	user: string;
	quiz: string;
	attempt: string;
	totalAttempts: number;
  expand?: {
    attempt?: Attempt,
    quiz?: Quiz,
    user?: User,
  }
}

export type UserAnswerCount = {
	id: string;
	collectionId: string;
	collectionName: string;
	user: string;
	attempt: string;
	question: string;
	answer: string;
	correctAnswers: number;
	totalAnswers: number;
  expand?: {
    answer?: Answer,
    attempt?: Attempt,
    user?: User,
  }
}

export type AttemptCorrectAnswers = {
	id: string;
	collectionId: string;
	collectionName: string;
	user: string;
	answer: string;
	question: string;
	correctAnswers: number;
}

export type PaginatedResults<T> = {
  page: number;
	perPage: number;
	totalItems: number;
	totalPages: number;
  items: T[]
}